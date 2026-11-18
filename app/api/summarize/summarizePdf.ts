// ไฟล์นี้ถูก import โดย route.ts เท่านั้น → รันบน server เท่านั้น
// ห้าม import ไฟล์นี้จาก component ฝั่ง client เด็ดขาด (API key จะรั่ว)

import { CLAUDE_MODEL, MAX_OUTPUT_TOKENS } from "@/lib/constants";
import type { Lecture } from "@/types/summary";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// error ที่ "ตั้งใจโยน" พร้อมข้อความที่โชว์ผู้ใช้ได้
export class SummarizeError extends Error {}

const PROMPT = `คุณคือติวเตอร์ที่ช่วยนักเรียนอ่านหนังสือสอบ อ่านเอกสาร PDF ที่แนบมา แล้วสรุปออกมา 2 แบบ:

1. bullets = โน้ตทบทวนก่อนสอบ: จุดที่น่าจะออกสอบ คำศัพท์สำคัญ ประเด็นหลักของแต่ละหัวข้อ
2. slides = อธิบายเนื้อหาทั้งหมดใหม่ทีละหัวข้อ ด้วยภาษาที่มือใหม่เข้าใจ ตัดส่วนที่ไม่สำคัญทิ้ง

กติกาภาษา: อธิบายเป็นภาษาไทย แต่ศัพท์เทคนิคให้คงภาษาเดิมของเอกสาร

ตอบเป็น JSON อย่างเดียว ไม่มีข้อความอื่น ไม่มี markdown โครงสร้างตาม TypeScript type นี้:

type TechnicalTerm = { word: string; meaning: string; rules?: string[]; cautions?: string[]; evokes?: string[] };
type Bullet = { bulletName: string; details: string[]; examples?: string[]; keyTakeaways?: string[]; technicalTerms?: TechnicalTerm[] };
type Slide = { topicName: string; details: string[]; examples?: string[]; keyTakeaways?: string[]; tips?: string[] };
type Lecture = { name: string; bullets: Bullet[]; slides: Slide[] };

- name = ชื่อเรื่องของเอกสาร
- evokes = ประโยคหรือคำช่วยจำสั้น ๆ
- field ที่มี ? ถ้าไม่มีเนื้อหาให้ละทิ้งไปเลย`;

export async function summarizePdf(file: File): Promise<Lecture> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // ข้อความนี้สำหรับ dev — ผู้ใช้เห็นแค่ข้อความกลาง ๆ จาก route.ts
    throw new Error("ไม่พบ ANTHROPIC_API_KEY ใน .env.local");
  }

  // แปลงไฟล์ (byte) → ข้อความ base64 เพื่อแนบไปใน JSON ได้
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  const res = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64,
              },
            },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    // log รายละเอียดไว้ดูใน Terminal แต่ไม่ส่งให้ผู้ใช้
    console.error("Claude API error", res.status, await res.text());
    if (res.status === 429) {
      throw new SummarizeError("มีคนใช้เยอะเกินไป รอสักครู่แล้วลองใหม่");
    }
    if (res.status === 400) {
      throw new SummarizeError(
        "Claude อ่าน PDF นี้ไม่ได้ (อาจยาวเกิน 100 หน้า หรือไฟล์เสีย)",
      );
    }
    throw new Error(`Claude API ตอบ ${res.status}`);
  }

  const data: {
    content: { type: string; text?: string }[];
    stop_reason: string;
  } = await res.json();

  if (data.stop_reason === "max_tokens") {
    throw new SummarizeError("เนื้อหายาวเกินไป สรุปไม่จบ ลองแบ่งไฟล์เป็นส่วนเล็ก ๆ");
  }

  const text = data.content.find((block) => block.type === "text")?.text ?? "";

  // เผื่อ Claude ห่อ JSON มาด้วย ```json ... ``` → ตัดเอาแค่ตั้งแต่ { ตัวแรก ถึง } ตัวสุดท้าย
  const jsonText = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);

  try {
    // TODO ก้อน 5: ตรวจว่า JSON หน้าตาตรงกับ type Lecture จริง ๆ
    return JSON.parse(jsonText) as Lecture;
  } catch {
    console.error("JSON พัง:", text);
    throw new SummarizeError("สรุปออกมาผิดรูปแบบ ลองกดใหม่อีกครั้ง");
  }
}
