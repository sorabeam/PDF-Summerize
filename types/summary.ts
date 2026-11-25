type TechnicalTerm = {
  word: string;
  meaning: string;
  rules?: string[];
  cautions?: string[];
  evokes?: string[];
};

// 1 ข้อในโน้ตทบทวน · exam = true คือ "จุดที่น่าจะออกสอบ" (หน้าเว็บไฮไลต์เหลือง)
type BulletDetail = {
  text: string;
  exam: boolean;
};

type Bullet = {
  bulletName: string;
  details: BulletDetail[];
  examples?: string[];
  keyTakeaways?: string[];
  technicalTerms?: TechnicalTerm[];
};

type Slide = {
  topicName: string;
  details: string[];
  examples?: string[];
  keyTakeaways?: string[];
  tips?: string[];
};

type Lecture = {
  name: string;
  bullets: Bullet[];
  slides: Slide[];
};

type Status = "idle" | "loading" | "error" | "done";

// คำตอบจาก POST /api/summarize · id = รหัสในประวัติ (null = โหมด mock หรือบันทึกไม่สำเร็จ)
type SummaryResponse = {
  id: string | null;
  lecture: Lecture;
};

// 1 แถวในรายการ "สรุปที่เคยทำ" (ยังไม่มีเนื้อหา เปิดแล้วค่อยโหลด)
type HistoryItem = {
  id: string;
  title: string;
  fileName: string;
  createdAt: string; // ISO string
};

// ประวัติ 1 รายการแบบเต็ม (GET /api/history/[id])
type HistoryEntry = {
  fileName: string;
  lecture: Lecture;
};

export type {
  TechnicalTerm,
  BulletDetail,
  Bullet,
  Slide,
  Lecture,
  Status,
  SummaryResponse,
  HistoryItem,
  HistoryEntry,
};
