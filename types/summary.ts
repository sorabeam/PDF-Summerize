type TechnicalTerm = {
  word: string;
  meaning: string;
  rules?: string[];
  cautions?: string[];
  evokes?: string[];
};

type Bullet = {
  bulletName: string;
  details: string[];
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

export type { TechnicalTerm, Bullet, Slide, Lecture, Status };
