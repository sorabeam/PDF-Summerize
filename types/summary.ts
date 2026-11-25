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

export type { TechnicalTerm, BulletDetail, Bullet, Slide, Lecture, Status };
