"use client";

import { useState } from "react";
import type { Bullet, TechnicalTerm } from "@/types/summary";
import { EyeIcon, EyeOffIcon } from "./icons";
import { BUTTON_SECONDARY, CARD, FOCUS, SECTION_RULE } from "./styles";

type Columns = 1 | 2 | 3;

// เขียน class เต็ม ๆ ไว้ (ห้ามต่อสตริงตอนรัน ไม่งั้น Tailwind หาไม่เจอ)
const GRID_COLUMNS: Record<Columns, string> = {
  1: "grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 xl:grid-cols-3",
};

// โน้ตทบทวนก่อนสอบ: การ์ดหัวข้อ (ไฮไลต์จุดออกสอบ) + คลังคำศัพท์ท้ายหน้า (ปิดความหมายเพื่อทดสอบตัวเองได้)
export function BulletView({ bullets }: { bullets: Bullet[] }) {
  const [columns, setColumns] = useState<Columns>(2);
  const hasExamPoints = bullets.some((bullet) => bullet.details.some((d) => d.exam));
  const allTerms = bullets.flatMap((bullet) => bullet.technicalTerms ?? []);

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {hasExamPoints ? (
            <p className="text-sm text-muted sm:text-[15px]">
              <mark className="rounded-[3px] bg-hl/75 px-1.5 py-px font-medium text-ink">ข้อความที่ไฮไลต์</mark>{" "}
              คือจุดที่น่าจะออกสอบ
            </p>
          ) : (
            <span />
          )}

          {/* มือถือแสดงคอลัมน์เดียวอยู่แล้ว → ซ่อนตัวเลือกนี้ */}
          <div className="hidden items-center gap-2.5 md:flex">
            <span id="columns-label" className="text-sm text-muted">
              คอลัมน์
            </span>
            <div
              role="radiogroup"
              aria-labelledby="columns-label"
              className="flex overflow-hidden rounded-lg border-[1.5px] border-ink"
            >
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={columns === n}
                  onClick={() => setColumns(n)}
                  className={`px-3.5 py-1 text-sm font-semibold tabular-nums ${FOCUS} ${columns === n ? "bg-ink text-paper" : "text-ink hover:bg-pen-soft"} ${n === 3 ? "hidden xl:block" : ""}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`grid items-start gap-4 sm:gap-6 ${GRID_COLUMNS[columns]}`}>
          {bullets.map((bullet, index) => (
            <BulletCard key={index} bullet={bullet} index={index} />
          ))}
        </div>
      </div>

      {allTerms.length > 0 && <Glossary terms={allTerms} />}
    </div>
  );
}

function BulletCard({ bullet, index }: { bullet: Bullet; index: number }) {
  return (
    <article className={`${CARD} flex flex-col p-5 sm:p-6`}>
      <p className="text-[13px] font-medium text-pen tabular-nums">หัวข้อ {index + 1}</p>
      <h3 className="mt-1 font-serif text-[19px] leading-snug font-bold sm:text-xl">{bullet.bulletName}</h3>

      <ul className="mt-3 space-y-2 leading-[1.65]">
        {bullet.details.map((detail, i) => (
          <li key={i} className="flex gap-2.5">
            <span aria-hidden className="text-muted">
              •
            </span>
            {detail.exam ? (
              // box-decoration-break: clone = ข้อความขึ้นบรรทัดใหม่แล้วไฮไลต์ยังมีมุมโค้ง/ระยะขอบทุกบรรทัด
              <span>
                <mark className="rounded-[3px] bg-hl/75 px-1.5 py-px text-ink [box-decoration-break:clone]">
                  <span className="sr-only">จุดที่น่าจะออกสอบ: </span>
                  {detail.text}
                </mark>
              </span>
            ) : (
              <span>{detail.text}</span>
            )}
          </li>
        ))}
      </ul>

      {bullet.keyTakeaways && <Callout title="สรุปสั้น ๆ" tone="pen" items={bullet.keyTakeaways} />}
      {bullet.examples && <Callout title="ตัวอย่าง" tone="plain" items={bullet.examples} />}

      {/* คำศัพท์ในหัวข้อนี้ = ป้ายเล็ก ๆ (ความหมายเต็มอยู่ในคลังคำศัพท์ด้านล่าง) */}
      {bullet.technicalTerms && (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-rule pt-4">
          {bullet.technicalTerms.map((term, i) => (
            <span
              key={i}
              title={term.meaning}
              className="cursor-help rounded-md border border-rule bg-background px-2 py-0.5 text-[13px] font-medium"
            >
              {term.word}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

// กล่องหัวข้อย่อย (ใช้ซ้ำทั้งใน BulletView และ SlideView)
// tone "hl" (เหลือง) = สิ่งที่ต้องจำ · "pen" (ฟ้า) = สรุป/ทริค · "plain" = ตัวอย่าง
export function Callout({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "hl" | "pen" | "plain";
}) {
  const style = {
    hl: "bg-hl/75",
    pen: "bg-pen-soft",
    plain: "border border-rule bg-background",
  }[tone];

  return (
    <div className={`mt-4 rounded-md px-4 py-3 ${style}`}>
      <p className="mb-1 text-[13px] font-semibold text-ink/70">{title}</p>
      <ul className="space-y-1 text-[15px] leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="whitespace-pre-wrap">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Glossary({ terms }: { terms: TechnicalTerm[] }) {
  const [quizMode, setQuizMode] = useState(false);
  // เก็บว่าเปิดดูคำไหนไปแล้วบ้าง (เก็บเป็นเลข index)
  const [revealed, setRevealed] = useState<number[]>([]);

  function toggleQuizMode() {
    setQuizMode(!quizMode);
    setRevealed([]);
  }

  return (
    <section className={SECTION_RULE}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h2 className="font-serif text-[22px] font-bold sm:text-[26px]">คลังคำศัพท์</h2>
          {quizMode ? (
            <span className="text-[13px] font-medium text-pen">โหมดทดสอบ</span>
          ) : (
            <span className="text-[15px] text-muted tabular-nums">{terms.length} คำ</span>
          )}
        </div>
        <button type="button" onClick={toggleQuizMode} className={`${BUTTON_SECONDARY} text-[15px]`}>
          {quizMode ? (
            "ออกจากโหมดทดสอบ"
          ) : (
            <>
              <EyeOffIcon className="size-[18px]" /> เริ่มโหมดทดสอบ
            </>
          )}
        </button>
      </div>

      {quizMode ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted tabular-nums sm:text-[15px]" aria-live="polite">
            เปิดดูแล้ว {revealed.length} จาก {terms.length} คำ
          </p>
          <button
            type="button"
            onClick={() => setRevealed(terms.map((_, i) => i))}
            disabled={revealed.length === terms.length}
            className={`${BUTTON_SECONDARY} px-3 py-1.5 text-sm`}
          >
            <EyeIcon className="size-4" /> แสดงทั้งหมด
          </button>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted sm:text-[15px]">
          โหมดทดสอบจะปิดความหมายไว้ ลองนึกคำตอบก่อนแล้วค่อยแตะเพื่อเปิดดู
        </p>
      )}

      <dl className="mt-3 grid gap-x-6 md:grid-cols-2">
        {terms.map((term, i) => {
          const hidden = quizMode && !revealed.includes(i);
          return (
            <div
              key={i}
              className="border-b border-rule py-3.5 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-x-4"
            >
              <dt className="font-semibold">{term.word}</dt>
              {hidden ? (
                <dd className="mt-2 sm:col-start-2 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => setRevealed([...revealed, i])}
                    className={`flex w-full items-center gap-2 rounded-md border border-dashed border-ink/25 bg-hl/35 px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-hl/60 ${FOCUS}`}
                  >
                    <EyeIcon className="size-4 shrink-0" />
                    ลองนึกก่อน แล้วแตะเพื่อดูความหมาย
                  </button>
                </dd>
              ) : (
                <>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted sm:col-start-2 sm:mt-0">
                    {term.meaning}
                  </dd>
                  {term.rules?.map((rule, j) => (
                    <dd key={`r${j}`} className="mt-1 text-sm text-muted sm:col-start-2">
                      • {rule}
                    </dd>
                  ))}
                  {term.cautions?.map((caution, j) => (
                    <dd key={`c${j}`} className="mt-1 text-sm text-danger sm:col-start-2">
                      ระวัง: {caution}
                    </dd>
                  ))}
                  {term.evokes && (
                    <dd className="mt-1.5 text-sm text-pen sm:col-start-2">ช่วยจำ: {term.evokes.join(", ")}</dd>
                  )}
                </>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
