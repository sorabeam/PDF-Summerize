import { auth } from "@/auth";
import { DAILY_SUMMARY_LIMIT, MAX_FILE_SIZE_MB } from "@/lib/constants";
import { countRecentSummaries, saveSummary } from "@/lib/db";
import mockLecture from "@/lib/mockLecture.json";
import type { Lecture, SummaryResponse } from "@/types/summary";
import { summarizePdf, SummarizeError } from "./summarizePdf";

// Claude อ่าน PDF ยาว ๆ อาจใช้เวลาเป็นนาที → ขอเวลาให้ route นี้นานสุด 300 วินาที (มีผลตอน deploy)
export const maxDuration = 300;

export async function POST(request: Request) {
  // ตั้ง USE_MOCK=1 ใน .env.local = ใช้ข้อมูลปลอม ไม่เสียเงิน ไม่ต้อง login ไม่บันทึกประวัติ (ใช้ตอนแต่ง UI)
  // ⚠️ ห้ามตั้ง USE_MOCK บน Vercel
  const useMock = process.env.USE_MOCK === "1";

  // ต้อง login ก่อน → คนนอกใช้ API key ของเราไม่ได้ (ตรวจฝั่ง server เสมอ ซ่อนปุ่มฝั่ง client อย่างเดียวไม่พอ)
  const session = useMock ? null : await auth();
  const userId = session?.user?.id;
  if (!useMock && !userId) {
    return Response.json({ error: "เข้าสู่ระบบด้วย Google ก่อนถึงจะสรุปได้" }, { status: 401 });
  }

  const formData = await request.formData();
  const uploadedFile = formData.get("uploadedFile");

  if (!(uploadedFile instanceof File)) {
    return Response.json(
      { error: "ไม่พบไฟล์ที่อัพโหลด" },
      { status: 400 },
    );
  }

  if (uploadedFile.size === 0) {
    return Response.json(
      { error: "ไฟล์ว่างเปล่า (0 MB)" },
      { status: 400 },
    );
  }

  if (uploadedFile.size / 1024 ** 2 > MAX_FILE_SIZE_MB) {
    return Response.json({ error: `ไฟล์ใหญ่เกินไป (ไม่เกิน ${MAX_FILE_SIZE_MB} MB)` }, { status: 413 });
  }

  const head = await uploadedFile.slice(0, 4).text();
  if (head !== "%PDF") {
    return Response.json(
      { error: "ประเภทไฟล์ไม่ถูกต้อง (ต้องเป็น PDF)" },
      { status: 415 },
    );
  }

  if (useMock || !userId) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const body: SummaryResponse = { id: null, lecture: mockLecture as Lecture };
    return Response.json(body);
  }

  try {
    if ((await countRecentSummaries(userId)) >= DAILY_SUMMARY_LIMIT) {
      return Response.json(
        { error: `วันนี้สรุปครบ ${DAILY_SUMMARY_LIMIT} ไฟล์แล้ว ลองใหม่พรุ่งนี้ (ไฟล์เดิมเปิดดูจากประวัติได้)` },
        { status: 429 },
      );
    }

    // request.signal จะ abort เมื่อผู้ใช้กด "ยกเลิกการสรุป" (หรือปิดหน้าเว็บ)
    const lecture = await summarizePdf(uploadedFile, request.signal);

    // บันทึกประวัติพัง ≠ สรุปพัง → ยังส่งผลให้ผู้ใช้อ่านได้ แค่ไม่มีในประวัติ
    let id: string | null = null;
    try {
      id = await saveSummary(userId, uploadedFile.name, lecture);
    } catch (err) {
      console.error("บันทึกประวัติไม่สำเร็จ", err);
    }

    const body: SummaryResponse = { id, lecture };
    return Response.json(body);
  } catch (err) {
    if (request.signal.aborted) {
      // ผู้ใช้ยกเลิกเอง ไม่ใช่ error → ไม่ต้อง log ยาว ๆ (ไม่มีใครรอรับคำตอบนี้แล้ว)
      console.log("ผู้ใช้ยกเลิกการสรุป");
      return new Response(null, { status: 499 });
    }
    // SummarizeError = เราตั้งใจโยน ข้อความโชว์ผู้ใช้ได้ · อย่างอื่น = บั๊ก/ตั้งค่าผิด
    if (err instanceof SummarizeError) {
      return Response.json({ error: err.message }, { status: 502 });
    }
    console.error(err);
    return Response.json(
      { error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ ลองใหม่ภายหลัง" },
      { status: 500 },
    );
  }
}
