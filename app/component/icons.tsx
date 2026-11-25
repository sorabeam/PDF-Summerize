// ไอคอนเล็ก ๆ แบบ SVG เขียนเอง (ไม่ต้องลง library เพิ่ม)
// ทุกตัวรับ className ได้ → กำหนดขนาด/สีด้วย Tailwind เช่น "size-5 text-pen"

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function FileIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

export function ChevronIcon({
  className,
  direction,
}: IconProps & { direction: "left" | "right" }) {
  return (
    <svg {...base} className={className}>
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z" />
    </svg>
  );
}

export function PenIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 20h9" />
      <path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z" />
    </svg>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13" />
    </svg>
  );
}

export function SlidesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21l5-5 5 5" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10.73 5.08a10.74 10.74 0 0 1 11.2 6.57 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-1.44 2.49M14.08 14.16a3 3 0 0 1-4.24-4.24" />
      <path d="M17.48 17.5a10.75 10.75 0 0 1-15.42-5.15 1 1 0 0 1 0-.7 10.75 10.75 0 0 1 4.45-5.14M2 2l20 20" />
    </svg>
  );
}

export function Spinner({ className }: IconProps) {
  return (
    <svg {...base} className={`animate-spin ${className ?? ""}`}>
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </svg>
  );
}

// เทปกาวสีเหลืองแปะหัวการ์ดกระดาษ (ตกแต่งอย่างเดียว screen reader ข้ามไป)
export function Tape({ className }: IconProps) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 -rotate-3 bg-hl/75 ${className ?? ""}`}
    />
  );
}
