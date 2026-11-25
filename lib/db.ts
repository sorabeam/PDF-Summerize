// ฐานข้อมูลประวัติการสรุป (Neon Postgres) — ใช้ฝั่ง server เท่านั้น
// ห้าม import ไฟล์นี้จาก component ฝั่ง client (DATABASE_URL มีรหัสผ่านฐานข้อมูล)
//
// ทุกฟังก์ชันรับ userId แล้วใส่ใน WHERE เสมอ → คนหนึ่งเปิด/ลบประวัติของอีกคนไม่ได้
// ใช้ sql`...` (tagged template) ค่าใน ${} ถูกส่งแยกจากคำสั่ง SQL → ปลอดภัยจาก SQL injection

import { neon } from "@neondatabase/serverless";
import type { HistoryEntry, HistoryItem, Lecture } from "@/types/summary";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("ไม่พบ DATABASE_URL ใน .env.local");
  }
  return neon(url);
}

// id ในตารางเป็น uuid → ถ้ารูปแบบผิดไม่ต้องถามฐานข้อมูลเลย (ไม่งั้น Postgres โยน error)
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidId(id: string): boolean {
  return UUID_PATTERN.test(id);
}

export async function saveSummary(userId: string, fileName: string, lecture: Lecture): Promise<string> {
  const sql = getSql();
  const rows = await sql`
    insert into summaries (user_id, file_name, title, lecture)
    values (${userId}, ${fileName}, ${lecture.name}, ${JSON.stringify(lecture)}::jsonb)
    returning id
  `;
  return String(rows[0].id);
}

export async function listSummaries(userId: string): Promise<HistoryItem[]> {
  const sql = getSql();
  const rows = await sql`
    select id, title, file_name, created_at
    from summaries
    where user_id = ${userId}
    order by created_at desc
    limit 100
  `;
  return rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    fileName: String(row.file_name),
    createdAt: new Date(row.created_at).toISOString(),
  }));
}

export async function getSummary(userId: string, id: string): Promise<HistoryEntry | null> {
  if (!isValidId(id)) return null;
  const sql = getSql();
  const rows = await sql`
    select file_name, lecture
    from summaries
    where id = ${id} and user_id = ${userId}
  `;
  if (rows.length === 0) return null;
  // jsonb ถูกแปลงกลับเป็น object ให้อัตโนมัติ (เราบันทึกเองหลังผ่าน parseSummary แล้ว จึงเชื่อรูปแบบได้)
  return { fileName: String(rows[0].file_name), lecture: rows[0].lecture as Lecture };
}

export async function deleteSummary(userId: string, id: string): Promise<boolean> {
  if (!isValidId(id)) return false;
  const sql = getSql();
  const rows = await sql`
    delete from summaries
    where id = ${id} and user_id = ${userId}
    returning id
  `;
  return rows.length > 0;
}

// นับว่า 24 ชม. ที่ผ่านมาสรุปไปกี่ไฟล์แล้ว (ใช้จำกัดโควตารายวัน)
export async function countRecentSummaries(userId: string): Promise<number> {
  const sql = getSql();
  const rows = await sql`
    select count(*)::int as total
    from summaries
    where user_id = ${userId} and created_at > now() - interval '24 hours'
  `;
  return Number(rows[0].total);
}
