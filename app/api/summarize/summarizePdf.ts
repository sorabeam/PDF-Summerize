// ไฟล์นี้ถูก import โดย route.ts เท่านั้น → รันบน server เท่านั้น
// ห้าม import ไฟล์นี้จาก component ฝั่ง client เด็ดขาด (API key จะรั่ว)

import { CLAUDE_MODEL, MAX_OUTPUT_TOKENS } from "@/lib/constants";
import type { Bullet, Lecture, Slide } from "@/types/summary";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// error ที่ "ตั้งใจโยน" พร้อมข้อความที่โชว์ผู้ใช้ได้
export class SummarizeError extends Error {}

const COMMON_RULES = `คุณคือติวเตอร์ที่ช่วยนักเรียนอ่านหนังสือสอบ อ่านเอกสาร PDF ที่แนบมา

กติกา:
- อธิบายเป็นภาษาไทย แต่ศัพท์เทคนิคให้คงภาษาเดิมของเอกสาร
- เขียนกระชับ ประโยคสั้น ไม่เกริ่น ไม่ซ้ำ ตัดน้ำทิ้ง
- field ที่มี ? ถ้าไม่มีเนื้อหาที่มีประโยชน์ให้ละทิ้งไปเลย
- ตอบเป็น JSON อย่างเดียว ไม่มีข้อความอื่น ไม่มี markdown`;

// แบ่งงานเป็น 2 คำสั่ง ส่งพร้อมกัน → เร็วขึ้นเกือบเท่าตัว และแต่ละอันมีเพดาน token ของตัวเอง
const BULLETS_PROMPT = `${COMMON_RULES}

งาน: ทำ "โน้ตทบทวนก่อนสอบ" — จุดที่น่าจะออกสอบ คำศัพท์สำคัญ ประเด็นหลักของแต่ละหัวข้อ
- ไม่เกิน 15 หัวข้อ · details หัวข้อละไม่เกิน 4 ข้อ
- evokes = คำหรือประโยคช่วยจำสั้น ๆ

โครงสร้าง JSON ตาม TypeScript type นี้:
type TechnicalTerm = { word: string; meaning: string; rules?: string[]; cautions?: string[]; evokes?: string[] };
type Bullet = { bulletName: string; details: string[]; examples?: string[]; keyTakeaways?: string[]; technicalTerms?: TechnicalTerm[] };
type Answer = { name: string; bullets: Bullet[] };   // name = ชื่อเรื่องของเอกสาร`;

const SLIDES_PROMPT = `${COMMON_RULES}

งาน: ทำ "สไลด์อธิบายใหม่" — อธิบายเนื้อหาทั้งหมดทีละหัวข้อ ด้วยภาษาที่มือใหม่เข้าใจ เรียงตามลำดับในเอกสาร
- ไม่เกิน 15 สไลด์ · details สไลด์ละไม่เกิน 5 ข้อ

โครงสร้าง JSON ตาม TypeScript type นี้:
type Slide = { topicName: string; details: string[]; examples?: string[]; keyTakeaways?: string[]; tips?: string[] };
type Answer = { slides: Slide[] };`;

export async function summarizePdf(file: File): Promise<Lecture> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // ข้อความนี้สำหรับ dev — ผู้ใช้เห็นแค่ข้อความกลาง ๆ จาก route.ts
    throw new Error("ไม่พบ ANTHROPIC_API_KEY ใน .env.local");
  }

  // แปลงไฟล์ (byte) → ข้อความ base64 เพื่อแนบไปใน JSON ได้
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  // Promise.all = ยิง 2 คำขอพร้อมกัน แล้วรอจนเสร็จทั้งคู่ (ถ้าอันไหนพัง จะพังทั้งก้อน)
  const [bulletPart, slidePart] = await Promise.all([
    askClaude<{ name: string; bullets: Bullet[] }>(apiKey, base64, BULLETS_PROMPT, "bullets"),
    askClaude<{ slides: Slide[] }>(apiKey, base64, SLIDES_PROMPT, "slides"),
  ]);

  return {
    name: bulletPart.name,
    bullets: bulletPart.bullets,
    slides: slidePart.slides,
  };
}

// ส่ง PDF + คำสั่ง 1 ชุด ไปให้ Claude แล้วแปลงคำตอบเป็น JSON
// <T> = "generic" — ผู้เรียกบอกเองว่าคาดว่าจะได้ JSON หน้าตาแบบไหนกลับมา
async function askClaude<T>(
  apiKey: string,
  base64: string,
  prompt: string,
  label: string,
): Promise<T> {
  const startedAt = Date.now();

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
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    // log รายละเอียดไว้ดูใน Terminal แต่ไม่ส่งให้ผู้ใช้
    console.error(`[${label}] Claude API error`, res.status, await res.text());
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
    usage: { input_tokens: number; output_tokens: number };
  } = await res.json();

  // ดูใน Terminal ได้ว่าแต่ละส่วนใช้เวลา/token เท่าไร (เอาไว้ปรับ MAX_OUTPUT_TOKENS)
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `[${label}] ${seconds}s · in ${data.usage.input_tokens} · out ${data.usage.output_tokens} · ${data.stop_reason}`,
  );

  if (data.stop_reason === "max_tokens") {
    throw new SummarizeError("เนื้อหายาวเกินไป สรุปไม่จบ ลองแบ่งไฟล์เป็นส่วนเล็ก ๆ");
  }

  const text = data.content.find((block) => block.type === "text")?.text ?? "";

  // เผื่อ Claude ห่อ JSON มาด้วย ```json ... ``` → ตัดเอาแค่ตั้งแต่ { ตัวแรก ถึง } ตัวสุดท้าย
  const jsonText = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);

  try {
    // TODO ก้อน 5: ตรวจว่า JSON หน้าตาตรงกับ type จริง ๆ
    return JSON.parse(jsonText) as T;
  } catch {
    console.error(`[${label}] JSON พัง:`, text);
    throw new SummarizeError("สรุปออกมาผิดรูปแบบ ลองกดใหม่อีกครั้ง");
  }
}
