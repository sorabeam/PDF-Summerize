// className ที่ใช้ซ้ำหลายที่ (เก็บไว้ที่เดียว แก้ทีเดียวเปลี่ยนทั้งเว็บ)

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30";

// ปุ่มหลัก: gradient + เงาสี + ลอยขึ้นตอนชี้ + ยุบตอนกด
export const BUTTON_PRIMARY = `inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-brand to-brand-2 px-5 py-2.5 font-medium text-on-accent shadow-lg shadow-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40 hover:brightness-110 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:brightness-100 ${FOCUS}`;

// ปุ่มรอง: ขอบสี พื้นขาว
export const BUTTON_SECONDARY = `inline-flex items-center justify-center gap-2 rounded-full border border-accent/30 bg-surface px-4 py-2 text-sm font-medium text-accent shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-sm ${FOCUS}`;

// การ์ดพื้นฐาน
export const CARD =
  "rounded-2xl border border-border bg-surface shadow-sm shadow-accent/5";

// การ์ดที่ชี้แล้วลอย
export const CARD_HOVER = `${CARD} transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10`;

// ชุดสีวนให้การ์ดแต่ละใบ (เขียนเต็ม ๆ ไว้ตรงนี้ Tailwind ถึงจะหาเจอและสร้าง CSS ให้)
export const CARD_COLORS = [
  {
    bar: "from-indigo-500 to-violet-500",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
    chip: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300",
  },
  {
    bar: "from-sky-500 to-cyan-400",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    chip: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  },
  {
    bar: "from-emerald-500 to-teal-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    bar: "from-amber-500 to-orange-400",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    chip: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  },
  {
    bar: "from-rose-500 to-pink-400",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    chip: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  },
  {
    bar: "from-fuchsia-500 to-purple-500",
    badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
    chip: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
  },
];

export function colorAt(index: number) {
  return CARD_COLORS[index % CARD_COLORS.length];
}
