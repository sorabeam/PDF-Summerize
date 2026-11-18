"use client";

import { useState } from "react";
import type { Bullet, TechnicalTerm } from "@/types/summary";

// โน้ตทบทวนก่อนสอบ: การ์ดทีละหัวข้อ + คลังคำศัพท์ท้ายหน้า (ซ่อนความหมายเพื่อทดสอบตัวเองได้)
export function BulletView({ bullets }: { bullets: Bullet[] }) {
  // รวมคำศัพท์จากทุกหัวข้อมาไว้ที่เดียว (derived — คำนวณจาก props ไม่ต้องเก็บ state)
  const allTerms = bullets.flatMap((bullet) => bullet.technicalTerms ?? []);

  return (
    <div className="flex flex-col gap-4">
      {bullets.map((bullet, index) => (
        <BulletCard key={index} bullet={bullet} number={index + 1} />
      ))}
      {allTerms.length > 0 && <Glossary terms={allTerms} />}
    </div>
  );
}

function BulletCard({ bullet, number }: { bullet: Bullet; number: number }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h3 className="flex items-baseline gap-3 text-lg font-semibold">
        <span className="text-sm font-medium text-accent tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
        {bullet.bulletName}
      </h3>

      <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-muted">
        {bullet.details.map((detail, i) => (
          <li key={i}>{detail}</li>
        ))}
      </ul>

      {bullet.keyTakeaways && (
        <Callout title="จำให้ขึ้นใจ" tone="highlight" items={bullet.keyTakeaways} />
      )}
      {bullet.examples && (
        <Callout title="ตัวอย่าง" tone="plain" items={bullet.examples} />
      )}

      {bullet.technicalTerms && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            คำศัพท์
          </p>
          <dl className="space-y-3">
            {bullet.technicalTerms.map((term, i) => (
              <TermDetail key={i} term={term} />
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}

// กล่องหัวข้อย่อย (ใช้ซ้ำทั้งใน BulletView และ SlideView)
export function Callout({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "highlight" | "plain" | "accent";
}) {
  const style = {
    highlight: "bg-highlight border-highlight-border",
    plain: "bg-surface-2 border-border",
    accent: "bg-accent-soft border-transparent",
  }[tone];

  return (
    <div className={`mt-4 rounded-xl border px-4 py-3 ${style}`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </p>
      <ul className="space-y-1 leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="whitespace-pre-wrap">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TermDetail({ term }: { term: TechnicalTerm }) {
  return (
    <div className="rounded-xl border border-border px-4 py-3">
      <dt className="font-semibold text-accent">{term.word}</dt>
      <dd className="mt-0.5 leading-relaxed">{term.meaning}</dd>
      {term.rules?.map((rule, i) => (
        <dd key={`r${i}`} className="mt-1 text-sm text-muted">
          • {rule}
        </dd>
      ))}
      {term.cautions?.map((caution, i) => (
        <dd key={`c${i}`} className="mt-1 text-sm text-danger">
          ระวัง: {caution}
        </dd>
      ))}
      {term.evokes && (
        <dd className="mt-1 text-sm italic text-muted">
          ช่วยจำ: {term.evokes.join(" · ")}
        </dd>
      )}
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
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">
          คำศัพท์ทั้งหมด <span className="text-muted">({terms.length})</span>
        </h3>
        <button
          type="button"
          onClick={toggleQuizMode}
          className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
        >
          {quizMode ? "แสดงความหมายทั้งหมด" : "ซ่อนความหมาย (ทดสอบตัวเอง)"}
        </button>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {terms.map((term, i) => {
          const hidden = quizMode && !revealed.includes(i);
          return (
            <div key={i} className="border-b border-border pb-3">
              <dt className="font-medium">{term.word}</dt>
              {hidden ? (
                <dd>
                  <button
                    type="button"
                    onClick={() => setRevealed([...revealed, i])}
                    className="text-sm text-accent underline underline-offset-4"
                  >
                    แตะเพื่อดูความหมาย
                  </button>
                </dd>
              ) : (
                <dd className="text-sm leading-relaxed text-muted">{term.meaning}</dd>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
