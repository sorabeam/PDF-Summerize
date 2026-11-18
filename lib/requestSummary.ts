import type { Lecture } from "@/types/summary";

// ส่งไฟล์ไปให้ /api/summarize แล้วรอผล (ฝั่ง client)
// สำเร็จ → คืน Lecture · ไม่สำเร็จ → throw Error ที่ข้อความโชว์ผู้ใช้ได้เลย
export async function requestSummary(file: File): Promise<Lecture> {
  const formData = new FormData();
  formData.append("uploadedFile", file);

  let res: Response;
  try {
    res = await fetch("/api/summarize", { method: "POST", body: formData });
  } catch {
    // fetch พังเอง = ติดต่อ server ไม่ได้เลย (server ปิด / เน็ตหลุด)
    throw new Error("ติดต่อเซิร์ฟเวอร์ไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่");
  }

  if (!res.ok) {
    // server ของเราส่ง { error: "..." } มา · แต่ถ้า error มาจาก Vercel เอง (413/504) จะไม่ใช่ JSON
    const body: { error?: string } = await res.json().catch(() => ({}));
    if (body.error) {
      throw new Error(body.error);
    }
    if (res.status === 413) {
      throw new Error("ไฟล์ใหญ่เกินกว่าที่เซิร์ฟเวอร์รับได้");
    }
    if (res.status === 504) {
      throw new Error("ใช้เวลานานเกินไป ลองไฟล์ที่สั้นลง");
    }
    throw new Error(`สรุปไม่สำเร็จ (รหัส ${res.status}) ลองใหม่อีกครั้ง`);
  }

  return res.json();
}
