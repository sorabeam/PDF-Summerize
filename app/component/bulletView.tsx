"use client";

import { useState } from "react";
import type { Bullet, TechnicalTerm } from "@/types/summary";
import { CARD, CARD_HOVER, BUTTON_SECONDARY, colorAt } from "./styles";

// โน้ตทบทวนก่อนสอบ: การ์ดเรียงเป็นตาราง grid + คลังคำศัพท์ท้ายหน้า (ซ่อนความหมายเพื่อทดสอบตัวเองได้)
export function BulletView({ bullets }: { bullets: Bullet[] }) {
  // รวมคำศัพท์จากทุกหัวข้อมาไว้ที่เดียว พร้อมจำว่ามาจากหัวข้อที่เท่าไร (ใช้ระบายสีให้ตรงกัน)
  const allTerms = bullets.flatMap((bullet, index) =>
    (bullet.technicalTerms ?? []).map((term) => ({ term, topicIndex: index })),
  );

  return (
    <div className="flex flex-col gap-10">
      {/* grid: มือถือ 1 คอลัมน์ · แท็บเล็ต 2 · จอใหญ่ 3 · การ์ดในแถวเดียวกันสูงเท่ากัน */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {bullets.map((bullet, index) => (
          <BulletCard key={index} bullet={bullet} index={index} />
        ))}
      </div>
      {allTerms.length > 0 && <Glossary entries={allTerms} />}
    </div>
  );
}

function BulletCard({ bullet, index }: { bullet: Bullet; index: number }) {
  const color = colorAt(index);

  return (
    <article
      className={`${CARD_HOVER} animate-rise relative flex flex-col overflow-hidden p-5`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* แถบสีด้านบนการ์ด */}
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${color.bar}`} />

      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold tabular-nums ${color.badge}`}
        >
          {index + 1}
        </span>
        <h3 className="text-lg font-semibold leading-snug">{bullet.bulletName}</h3>
      </div>

      <ul className="mt-4 space-y-2 leading-relaxed">
        {bullet.details.map((detail, i) => (
          <li key={i} className="flex gap-2">
            <span className={`mt-2.5 size-1.5 shrink-0 rounded-full bg-linear-to-r ${color.bar}`} />
            <span>{detail}</span>
          </li>
        ))}
      </ul>

      {bullet.keyTakeaways && (
        <Callout title="⭐ จำให้ขึ้นใจ" tone="highlight" items={bullet.keyTakeaways} />
      )}
      {bullet.examples && (
        <Callout title="ตัวอย่าง" tone="plain" items={bullet.examples} />
      )}

      {/* คำศัพท์ในหัวข้อนี้ = ป้ายเล็ก ๆ (ความหมายเต็มอยู่ในคลังคำศัพท์ด้านล่าง) */}
      {bullet.technicalTerms && (
        <div className="mt-auto pt-4">
          <p className="mb-2 text-xs font-semibold text-muted">คำศัพท์</p>
          <div className="flex flex-wrap gap-1.5">
            {bullet.technicalTerms.map((term, i) => (
              <span
                key={i}
                title={term.meaning}
                className={`cursor-help rounded-full border px-2.5 py-0.5 text-xs font-medium ${color.chip}`}
              >
                {term.word}
              </span>
            ))}
          </div>
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
    accent: "bg-accent-soft border-accent/30",
  }[tone];

  return (
    <div className={`mt-4 rounded-xl border px-4 py-3 ${style}`}>
      <p className="mb-1 text-xs font-semibold text-muted">{title}</p>
      <ul className="space-y-1 text-[0.95rem] leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="whitespace-pre-wrap">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

type GlossaryEntry = { term: TechnicalTerm; topicIndex: number };

function Glossary({ entries }: { entries: GlossaryEntry[] }) {
  const [quizMode, setQuizMode] = useState(false);
  // เก็บว่าเปิดดูคำไหนไปแล้วบ้าง (เก็บเป็นเลข index)
  const [revealed, setRevealed] = useState<number[]>([]);

  function toggleQuizMode() {
    setQuizMode(!quizMode);
    setRevealed([]);
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">
            คลังคำศัพท์{" "}
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-sm text-accent">
              {entries.length}
            </span>
          </h3>
          <p className="mt-1 text-sm text-muted">
            {quizMode ? "นึกความหมายก่อน แล้วค่อยแตะการ์ดเพื่อเฉลย" : "ทุกคำจากทุกหัวข้อ รวมไว้ที่เดียว"}
          </p>
        </div>
        <button type="button" onClick={toggleQuizMode} className={BUTTON_SECONDARY}>
          {quizMode ? "เฉลยทั้งหมด" : "🧠 โหมดทดสอบตัวเอง"}
        </button>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map(({ term, topicIndex }, i) => {
          const hidden = quizMode && !revealed.includes(i);
          const color = colorAt(topicIndex);
          return (
            <div
              key={i}
              className={`${CARD} relative overflow-hidden p-4 ${hidden ? "transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md" : ""}`}
            >
              <div className={`absolute inset-y-0 left-0 w-1 bg-linear-to-b ${color.bar}`} />
              <dt className="font-semibold">{term.word}</dt>
              {hidden ? (
                <dd className="mt-1">
                  {/* after:absolute after:inset-0 = ขยายพื้นที่กดให้เต็มการ์ด */}
                  <button
                    type="button"
                    onClick={() => setRevealed([...revealed, i])}
                    className="text-sm text-accent after:absolute after:inset-0 focus-visible:outline-none focus-visible:underline"
                  >
                    แตะเพื่อดูความหมาย
                  </button>
                </dd>
              ) : (
                <>
                  <dd className="mt-1 text-sm leading-relaxed">{term.meaning}</dd>
                  {term.rules?.map((rule, j) => (
                    <dd key={`r${j}`} className="mt-1 text-xs text-muted">
                      • {rule}
                    </dd>
                  ))}
                  {term.cautions?.map((caution, j) => (
                    <dd key={`c${j}`} className="mt-1 text-xs text-danger">
                      ⚠ {caution}
                    </dd>
                  ))}
                  {term.evokes && (
                    <dd className="mt-2 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-xs italic text-muted">
                      💡 {term.evokes.join(" · ")}
                    </dd>
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
