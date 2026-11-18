import { MAX_FILE_SIZE_MB } from "./constants";

// ตรวจไฟล์ฝั่ง client (ให้ผู้ใช้รู้ทันที) — server ตรวจซ้ำอีกรอบเสมอ เพราะ server ห้ามเชื่อ client
// คืน null = ผ่าน · คืน string = ข้อความบอกว่าผิดอะไร
export function getFileError(file: File): string | null {
  if (file.type !== "application/pdf") {
    return "รองรับเฉพาะไฟล์ PDF";
  }
  if (file.size === 0) {
    return "ไฟล์ว่างเปล่า (0 MB)";
  }
  if (file.size / 1024 ** 2 > MAX_FILE_SIZE_MB) {
    return `ไฟล์ใหญ่เกินไป (ไม่เกิน ${MAX_FILE_SIZE_MB} MB)`;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}
