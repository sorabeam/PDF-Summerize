"use client";

import { useEffect, useState } from "react";
import type { Slide } from "@/types/summary";
import { Callout } from "./bulletView";
import { ChevronIcon } from "./icons";
import { BUTTON_SECONDARY, CARD, colorAt } from "./styles";

// สไลด์อธิบาย: ดูทีละหน้า (ปุ่ม / ลูกศร ← →) + ตาราง "ทุกหัวข้อ" ด้านล่างไว้กระโดดไปหน้าไหนก็ได้
export function SlideView({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const color = colorAt(index);
  const isFirst = index === 0;
  const isLast = index === slides.length - 1;

  // ฟังปุ่มลูกศรบนคีย์บอร์ดตลอดเวลาที่ SlideView อยู่บนจอ
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setIndex((i) => Math.min(i + 1, slides.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slides.length]);

  function goTo(i: number) {
    setIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        {/* key={index} = เปลี่ยนสไลด์แล้ว React สร้างการ์ดใหม่ → animation เล่นใหม่ทุกครั้ง */}
        <article
          key={index}
          className={`${CARD} animate-rise relative flex min-h-[460px] flex-col overflow-hidden shadow-lg`}
        >
          <div className={`bg-linear-to-r ${color.bar} px-6 py-5 text-white sm:px-10 sm:py-7`}>
            <p className="text-sm font-medium text-white/80 tabular-nums">
              สไลด์ {index + 1} / {slides.length}
            </p>
            <h3 className="mt-1 text-2xl font-semibold leading-snug sm:text-3xl">
              {slide.topicName}
            </h3>
          </div>

          <div className="flex flex-1 flex-col p-6 sm:p-10">
            <ul className="space-y-3 text-lg leading-relaxed">
              {slide.details.map((detail, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`mt-3 size-2 shrink-0 rounded-full bg-linear-to-r ${color.bar}`} />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto grid gap-x-4 pt-4 md:grid-cols-2">
              {slide.examples && (
                <Callout title="ตัวอย่าง" tone="plain" items={slide.examples} />
              )}
              {slide.keyTakeaways && (
                <Callout title="⭐ สรุปสั้น ๆ" tone="highlight" items={slide.keyTakeaways} />
              )}
              {slide.tips && <Callout title="💡 ทริค" tone="accent" items={slide.tips} />}
            </div>
          </div>
        </article>

        <nav className="mt-4 flex items-center justify-between gap-3" aria-label="เลื่อนสไลด์">
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            disabled={isFirst}
            className={BUTTON_SECONDARY}
          >
            <ChevronIcon direction="left" className="size-4" /> ก่อนหน้า
          </button>

          {/* แถบความคืบหน้า */}
          <div className="mx-2 hidden h-2 flex-1 overflow-hidden rounded-full bg-surface-2 sm:block">
            <div
              className="h-full rounded-full bg-linear-to-r from-accent to-accent-2 transition-all duration-300"
              style={{ width: `${((index + 1) / slides.length) * 100}%` }}
            />
          </div>

          <button
            type="button"
            onClick={() => setIndex(index + 1)}
            disabled={isLast}
            className={BUTTON_SECONDARY}
          >
            ถัดไป <ChevronIcon direction="right" className="size-4" />
          </button>
        </nav>
        <p className="mt-2 hidden text-center text-xs text-muted sm:block">
          ใช้ปุ่มลูกศร ← → บนคีย์บอร์ดได้
        </p>
      </div>

      {/* ตารางทุกหัวข้อ */}
      <section>
        <h3 className="mb-4 text-xl font-semibold">ทุกหัวข้อ</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((s, i) => {
            const c = colorAt(i);
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`${CARD} group flex items-start gap-3 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 ${active ? "border-accent ring-2 ring-accent/30" : ""}`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold tabular-nums ${c.badge}`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium leading-snug group-hover:text-accent">
                    {s.topicName}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm text-muted">
                    {s.details[0]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
