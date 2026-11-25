// className ที่ใช้ซ้ำหลายที่ (เก็บไว้ที่เดียว แก้ทีเดียวเปลี่ยนทั้งเว็บ)
// ธีมสมุดโน้ต: ขอบหมึก + เงาแข็ง แทนเงาฟุ้ง ๆ · ไม่มี gradient

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-pen focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// ปุ่มหลัก: พื้นหมึก + เงาแข็งสีเหลือง · กดแล้วยุบลงไปทับเงา
export const BUTTON_PRIMARY = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-ink px-5 py-3 font-semibold text-paper shadow-press transition-[transform,box-shadow] duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--hl)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--hl)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-press ${FOCUS}`;

// ปุ่มรอง: พื้นกระดาษ ขอบหมึก
export const BUTTON_SECONDARY = `inline-flex items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-ink bg-paper px-4 py-2.5 font-semibold text-ink transition-colors duration-150 hover:bg-pen-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-paper ${FOCUS}`;

// ปุ่มไอคอนสี่เหลี่ยม (ลูกศรสไลด์, ปุ่ม + บนมือถือ)
export const BUTTON_ICON = `inline-grid size-11 place-items-center rounded-[10px] border-[1.5px] border-ink bg-paper text-ink transition-colors duration-150 hover:bg-pen-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-paper ${FOCUS}`;

// การ์ดกระดาษหลัก (กล่องอัปโหลด, การ์ดรอ, การ์ดสไลด์): ขอบหมึก + เงาแข็ง
export const PAPER_CARD =
  "relative rounded-[14px] border-[1.5px] border-ink bg-paper shadow-paper-sm sm:shadow-paper";

// การ์ดเนื้อหาด้านใน (หัวข้อโน้ต)
export const CARD = "rounded-[10px] border border-rule bg-card";

// หัวข้อ serif
export const SERIF_HEADING = "font-serif font-bold text-ink";

// หัวส่วน (คลังคำศัพท์, สไลด์ทั้งหมด): เส้นหมึกด้านบน
export const SECTION_RULE = "border-t-[1.5px] border-ink pt-5";
