"use client";

import { useEffect, useState } from "react";
import type { Slide } from "@/types/summary";
import { Callout } from "./bulletView";
import { ChevronIcon } from "./icons";

// สไลด์อธิบาย: ดูทีละหน้า · กดปุ่ม หรือใช้ลูกศร ← → บนคีย์บอร์ด
export function SlideView({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
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

  return (
    <div>
      <article className="flex min-h-[440px] flex-col rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <p className="text-sm font-medium text-accent tabular-nums">
          สไลด์ {index + 1} / {slides.length}
        </p>
        <h3 className="mt-2 text-2xl font-semibold leading-snug sm:text-3xl">
          {slide.topicName}
        </h3>

        <ul className="mt-6 list-disc space-y-2.5 pl-6 text-lg leading-relaxed marker:text-accent">
          {slide.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>

        <div className="mt-auto grid gap-x-4 pt-4 md:grid-cols-2">
          {slide.examples && (
            <Callout title="ตัวอย่าง" tone="plain" items={slide.examples} />
          )}
          {slide.keyTakeaways && (
            <Callout title="สรุปสั้น ๆ" tone="highlight" items={slide.keyTakeaways} />
          )}
          {slide.tips && <Callout title="ทริค" tone="accent" items={slide.tips} />}
        </div>
      </article>

      <nav className="mt-4 flex items-center justify-between gap-3" aria-label="เลื่อนสไลด์">
        <button
          type="button"
          onClick={() => setIndex(index - 1)}
          disabled={isFirst}
          className="flex items-center gap-1 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-accent disabled:opacity-40 disabled:hover:border-border"
        >
          <ChevronIcon direction="left" className="size-4" /> ก่อนหน้า
        </button>

        {/* จุดบอกตำแหน่ง — กดกระโดดไปสไลด์นั้นได้ */}
        <div className="hidden flex-wrap justify-center gap-1.5 sm:flex">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`ไปสไลด์ ${i + 1}: ${s.topicName}`}
              title={s.topicName}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-accent" : "w-2 bg-border hover:bg-muted"}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIndex(index + 1)}
          disabled={isLast}
          className="flex items-center gap-1 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-accent disabled:opacity-40 disabled:hover:border-border"
        >
          ถัดไป <ChevronIcon direction="right" className="size-4" />
        </button>
      </nav>
      <p className="mt-2 hidden text-center text-xs text-muted sm:block">
        ใช้ปุ่มลูกศร ← → บนคีย์บอร์ดได้
      </p>
    </div>
  );
}
