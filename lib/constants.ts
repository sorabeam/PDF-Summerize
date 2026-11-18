export const MAX_FILE_SIZE_MB = 10;

// ---- ใช้ฝั่ง server เท่านั้น (ไม่ใช่ความลับ แต่ client ไม่ได้ใช้) ----
// รุ่นของ Claude ที่ใช้สรุป — อยากประหยัดเปลี่ยนเป็น "claude-haiku-5-5" ได้
export const CLAUDE_MODEL = "claude-sonnet-5-5";
// จำนวน token สูงสุดที่ Claude ตอบได้ "ต่อ 1 คำขอ" (bullets กับ slides แยกกันคนละเพดาน)
// ภาษาไทยกิน token เยอะ · ตั้งสูงเกินไปก็ไม่ดี: ยิ่งยาวยิ่งรอนาน (fetch ของ Node รอได้ราว 5 นาที)
export const MAX_OUTPUT_TOKENS = 24000;
