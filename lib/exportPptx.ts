// สร้างไฟล์ .pptx จากผลสรุป (รันในเบราว์เซอร์) ด้วย library pptxgenjs
// docs: https://gitbrent.github.io/PptxGenJS/

import PptxGenJS from "pptxgenjs";
import type { Bullet, Lecture, Slide } from "@/types/summary";

// ---- หน้าตา ----
const FONT = "Tahoma"; // มีตัวไทยในทุกเครื่อง (Windows / Mac / Google Slides)
const COLOR = {
  text: "1D1C1A",
  muted: "6B6860",
  accent: "2F5BD3",
  accentSoft: "E9EEFC",
  paper: "FFFFFF",
};
const SLIDE_W = 13.33; // LAYOUT_WIDE = 13.33 x 7.5 นิ้ว (16:9)
const MARGIN = 0.6;
const BODY_FONT_SIZE = 18;

// ---- กันข้อความล้นสไลด์ ----
// pptx ไม่ย่อตัวอักษรให้เอง → เราประมาณจำนวนบรรทัด ถ้าเกินก็แบ่งไปสไลด์ใหม่ "(ต่อ)"
const CHARS_PER_LINE = 95; // ประมาณที่ 18pt บนความกว้าง ~12 นิ้ว (เผื่อไว้นิดหน่อย)
const MAX_LINES_PER_SLIDE = 14;

// เนื้อหา 1 ชิ้นบนสไลด์: หัวข้อย่อย (ถ้ามี) + รายการ
type Block = { heading?: string; items: string[] };
type Line = { text: string; isHeading: boolean };

function estimateLines(text: string): number {
  // ไม่นับสระบน/ล่าง/วรรณยุกต์ไทย เพราะไม่กินความกว้าง
  const visible = text.replace(/[ัิ-ฺ็-๎]/g, "");
  return Math.max(1, Math.ceil(visible.length / CHARS_PER_LINE));
}

// แบ่ง blocks เป็นหลายหน้า หน้าละไม่เกิน MAX_LINES_PER_SLIDE บรรทัด
function paginate(blocks: Block[]): Line[][] {
  const pages: Line[][] = [];
  let page: Line[] = [];
  let used = 0;

  function push(line: Line, cost: number) {
    if (used + cost > MAX_LINES_PER_SLIDE && page.length > 0) {
      pages.push(page);
      page = [];
      used = 0;
    }
    page.push(line);
    used += cost;
  }

  for (const block of blocks) {
    if (block.items.length === 0) continue;
    if (block.heading) {
      // หัวข้อย่อย + บรรทัดแรก ต้องอยู่หน้าเดียวกัน (ไม่ให้หัวข้อค้างท้ายหน้า)
      const firstCost = estimateLines(block.items[0]);
      if (used + 1.4 + firstCost > MAX_LINES_PER_SLIDE && page.length > 0) {
        pages.push(page);
        page = [];
        used = 0;
      }
      push({ text: block.heading, isHeading: true }, 1.4);
    }
    for (const item of block.items) {
      push({ text: item, isHeading: false }, estimateLines(item));
    }
  }
  if (page.length > 0) pages.push(page);
  return pages;
}

function addContentSlides(pptx: PptxGenJS, title: string, section: string, blocks: Block[]) {
  const pages = paginate(blocks);
  pages.forEach((lines, i) => {
    const slide = pptx.addSlide({ masterName: "CONTENT" });
    slide.addText(section, {
      x: MARGIN, y: 0.35, w: 8, h: 0.35,
      fontFace: FONT, fontSize: 12, color: COLOR.accent, bold: true,
    });
    slide.addText(i === 0 ? title : `${title} (ต่อ)`, {
      x: MARGIN, y: 0.7, w: SLIDE_W - MARGIN * 2, h: 0.9,
      fontFace: FONT, fontSize: 28, bold: true, color: COLOR.text, valign: "middle",
      fit: "shrink",
    });
    slide.addText(
      lines.map((line) =>
        line.isHeading
          ? {
              text: line.text,
              options: { bold: true, color: COLOR.accent, fontSize: 14, breakLine: true, paraSpaceBefore: 8 },
            }
          : {
              text: line.text,
              options: { bullet: { indent: 18 }, breakLine: true, paraSpaceAfter: 4 },
            },
      ),
      {
        x: MARGIN, y: 1.75, w: SLIDE_W - MARGIN * 2, h: 5.2,
        fontFace: FONT, fontSize: BODY_FONT_SIZE, color: COLOR.text, valign: "top",
        lineSpacingMultiple: 1.1,
      },
    );
  });
}

function slideBlocks(slide: Slide): Block[] {
  return [
    { items: slide.details },
    { heading: "ตัวอย่าง", items: slide.examples ?? [] },
    { heading: "สรุปสั้น ๆ", items: slide.keyTakeaways ?? [] },
    { heading: "ทริค", items: slide.tips ?? [] },
  ];
}

function bulletBlocks(bullet: Bullet): Block[] {
  const terms = (bullet.technicalTerms ?? []).map((term) => {
    const extra = [
      ...(term.cautions ?? []).map((c) => `ระวัง: ${c}`),
      ...(term.evokes ?? []).map((e) => `ช่วยจำ: ${e}`),
    ];
    return [`${term.word} — ${term.meaning}`, ...extra].join("  ·  ");
  });
  return [
    { items: bullet.details },
    { heading: "จำให้ขึ้นใจ", items: bullet.keyTakeaways ?? [] },
    { heading: "ตัวอย่าง", items: bullet.examples ?? [] },
    { heading: "คำศัพท์", items: terms },
  ];
}

function addSectionSlide(pptx: PptxGenJS, title: string, subtitle: string) {
  const slide = pptx.addSlide();
  slide.background = { color: COLOR.accentSoft };
  slide.addText(title, {
    x: MARGIN, y: 2.8, w: SLIDE_W - MARGIN * 2, h: 1,
    fontFace: FONT, fontSize: 36, bold: true, color: COLOR.accent,
  });
  slide.addText(subtitle, {
    x: MARGIN, y: 3.8, w: SLIDE_W - MARGIN * 2, h: 0.6,
    fontFace: FONT, fontSize: 16, color: COLOR.muted,
  });
}

// ชื่อไฟล์ห้ามมีตัวอักษรพิเศษบางตัว (Windows)
function toFileName(name: string): string {
  const safe = name.replace(/[\\/:*?"<>|]/g, "-").trim().slice(0, 80);
  return `${safe || "summary"}.pptx`;
}

// สร้าง object pptx (แยกออกมาเพื่อให้ทดสอบได้โดยไม่ต้องดาวน์โหลด)
export function buildPresentation(lecture: Lecture): PptxGenJS {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = lecture.name;

  pptx.defineSlideMaster({
    title: "CONTENT",
    background: { color: COLOR.paper },
    objects: [
      { rect: { x: 0, y: 0, w: SLIDE_W, h: 0.12, fill: { color: COLOR.accent } } },
      {
        text: {
          text: lecture.name,
          options: { x: MARGIN, y: 7.0, w: 10, h: 0.3, fontFace: FONT, fontSize: 10, color: COLOR.muted },
        },
      },
    ],
    slideNumber: { x: SLIDE_W - MARGIN - 0.6, y: 7.0, w: 0.6, h: 0.3, fontFace: FONT, fontSize: 10, color: COLOR.muted, align: "right" },
  });

  // หน้าปก
  const cover = pptx.addSlide();
  cover.background = { color: COLOR.accent };
  cover.addText(lecture.name, {
    x: MARGIN, y: 2.2, w: SLIDE_W - MARGIN * 2, h: 2,
    fontFace: FONT, fontSize: 40, bold: true, color: "FFFFFF", valign: "bottom", fit: "shrink",
  });
  cover.addText(
    `${lecture.slides.length} สไลด์อธิบาย · ${lecture.bullets.length} หัวข้อทบทวน · สรุปโดย PDF Summarizer`,
    { x: MARGIN, y: 4.4, w: SLIDE_W - MARGIN * 2, h: 0.5, fontFace: FONT, fontSize: 16, color: "DCE5FB" },
  );

  addSectionSlide(pptx, "สไลด์อธิบาย", "อธิบายเนื้อหาใหม่ทีละหัวข้อ ด้วยภาษาที่เข้าใจง่าย");
  for (const slide of lecture.slides) {
    addContentSlides(pptx, slide.topicName, "สไลด์อธิบาย", slideBlocks(slide));
  }

  addSectionSlide(pptx, "โน้ตทบทวนก่อนสอบ", "จุดที่น่าจะออกสอบ + คำศัพท์สำคัญ");
  for (const bullet of lecture.bullets) {
    addContentSlides(pptx, bullet.bulletName, "โน้ตทบทวน", bulletBlocks(bullet));
  }

  return pptx;
}

export async function exportLectureToPptx(lecture: Lecture): Promise<void> {
  await buildPresentation(lecture).writeFile({ fileName: toFileName(lecture.name) });
}
