// ตรวจ + ทำความสะอาด JSON ที่ Claude ตอบมา ก่อนส่งให้หน้าเว็บ
//
// ทำไมต้องตรวจ? `JSON.parse(text) as Lecture` แค่ "บอก" TypeScript ว่าเป็น Lecture
// แต่ไม่ได้ "เช็ก" จริงตอนรัน — ถ้า Claude ลืม field หรือส่ง string มาแทน array
// หน้าเว็บจะพังตอน .map() ในก้อน 6
//
// หลักการ: field บังคับหาย/ผิด → ทิ้งชิ้นนั้น · field optional ผิด → ตัด field นั้นทิ้ง
// ถ้าทิ้งจนไม่เหลืออะไรเลย → ถือว่าสรุปพัง

import type { Bullet, BulletDetail, Slide, TechnicalTerm } from "@/types/summary";

// unknown = "ยังไม่รู้ว่าเป็นอะไร" ต้องเช็กก่อนถึงจะใช้ได้ (ปลอดภัยกว่า any)
type UnknownObject = Record<string, unknown>;

function isObject(value: unknown): value is UnknownObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

// รับอะไรมาก็ได้ → คืน string[] ที่มีแต่ข้อความจริง ๆ (ถ้าไม่ใช่ array คืน [])
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isNonEmptyString).map((s) => s.trim());
}

// สำหรับ field optional: ถ้าว่างก็ไม่ต้องใส่ field นั้นเลย (undefined)
function optionalStrings(value: unknown): string[] | undefined {
  const list = toStringArray(value);
  return list.length > 0 ? list : undefined;
}

// ตัดแต่ละ item ที่ parse ไม่ผ่าน (null) ออก
function parseList<T>(value: unknown, parseItem: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.map(parseItem).filter((item): item is T => item !== null);
}

function parseTechnicalTerm(raw: unknown): TechnicalTerm | null {
  if (!isObject(raw)) return null;
  if (!isNonEmptyString(raw.word) || !isNonEmptyString(raw.meaning)) return null;
  return {
    word: raw.word.trim(),
    meaning: raw.meaning.trim(),
    rules: optionalStrings(raw.rules),
    cautions: optionalStrings(raw.cautions),
    evokes: optionalStrings(raw.evokes),
  };
}

// 1 ข้อในโน้ต: รับได้ทั้งแบบใหม่ { text, exam } และแบบเก่าที่เป็น string เฉย ๆ (ถือว่าไม่ใช่จุดออกสอบ)
// exam ต้องเป็น true จริง ๆ เท่านั้น — ถ้า Claude ส่ง "true" (string) หรือลืมใส่ → false
function parseBulletDetail(raw: unknown): BulletDetail | null {
  if (isNonEmptyString(raw)) return { text: raw.trim(), exam: false };
  if (!isObject(raw) || !isNonEmptyString(raw.text)) return null;
  return { text: raw.text.trim(), exam: raw.exam === true };
}

function parseBullet(raw: unknown): Bullet | null {
  if (!isObject(raw) || !isNonEmptyString(raw.bulletName)) return null;
  const details = parseList(raw.details, parseBulletDetail);
  if (details.length === 0) return null;
  const technicalTerms = parseList(raw.technicalTerms, parseTechnicalTerm);
  return {
    bulletName: raw.bulletName.trim(),
    details,
    examples: optionalStrings(raw.examples),
    keyTakeaways: optionalStrings(raw.keyTakeaways),
    technicalTerms: technicalTerms.length > 0 ? technicalTerms : undefined,
  };
}

function parseSlide(raw: unknown): Slide | null {
  if (!isObject(raw) || !isNonEmptyString(raw.topicName)) return null;
  const details = toStringArray(raw.details);
  if (details.length === 0) return null;
  return {
    topicName: raw.topicName.trim(),
    details,
    examples: optionalStrings(raw.examples),
    keyTakeaways: optionalStrings(raw.keyTakeaways),
    tips: optionalStrings(raw.tips),
  };
}

// ---- ที่ summarizePdf.ts เรียกใช้ ----
// คืน null = ใช้ไม่ได้เลย

export function parseBulletPart(raw: unknown): { name: string; bullets: Bullet[] } | null {
  if (!isObject(raw)) return null;
  const bullets = parseList(raw.bullets, parseBullet);
  if (bullets.length === 0) return null;
  const name = isNonEmptyString(raw.name) ? raw.name.trim() : "ไม่มีชื่อเรื่อง";
  return { name, bullets };
}

export function parseSlidePart(raw: unknown): { slides: Slide[] } | null {
  if (!isObject(raw)) return null;
  const slides = parseList(raw.slides, parseSlide);
  if (slides.length === 0) return null;
  return { slides };
}
