import { MAX_FILE_SIZE_MB } from "@/lib/constants";
import mockLecture from "@/lib/mockLecture.json";
import { summarizePdf, SummarizeError } from "./summarizePdf";

// Claude อ่าน PDF ยาว ๆ อาจใช้เวลาเป็นนาที → ขอเวลาให้ route นี้นานสุด 300 วินาที (มีผลตอน deploy)
export const maxDuration = 300;

export async function POST(request: Request) {
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

  // ตั้ง USE_MOCK=1 ใน .env.local = ใช้ข้อมูลปลอม ไม่เสียเงินตอนแต่ง UI
  if (process.env.USE_MOCK === "1") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Response.json(mockLecture);
  }

  try {
    const lecture = await summarizePdf(uploadedFile);
    return Response.json(lecture);
  } catch (err) {
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
