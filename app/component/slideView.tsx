"use client";

import { useEffect, useRef, useState } from "react";
import type { Slide } from "@/types/summary";
import { Callout } from "./bulletView";
import { ChevronIcon, Tape } from "./icons";
import { BUTTON_ICON, BUTTON_PRIMARY, BUTTON_SECONDARY, FOCUS, SECTION_RULE } from "./styles";

// คนที่ตั้งค่า "ลดการเคลื่อนไหว" ไว้ → เลื่อนจอแบบกระโดด ไม่ไหลนุ่ม ๆ
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

// สไลด์อธิบาย: ดูทีละหน้า (ปุ่ม / ลูกศร ← →) + รายการ "สไลด์ทั้งหมด" ไว้กระโดดไปหน้าไหนก็ได้
export function SlideView({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
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

  // มือถือ: รายการสไลด์เป็นแถบเลื่อนแนวนอน → เลื่อนให้สไลด์ที่เปิดอยู่โผล่ในแถบเสมอ
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[index];
    if (!list || !(item instanceof HTMLElement)) return;
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: item.offsetLeft - 16, behavior: scrollBehavior() });
    }
  }, [index]);

  function goTo(i: number) {
    setIndex(i);
    topRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div ref={topRef} className="flex scroll-mt-4 items-center gap-4 sm:gap-5">
        <p className="shrink-0 text-sm text-muted sm:text-[15px]">
          สไลด์{" "}
          <span className="font-serif text-xl font-bold text-ink tabular-nums sm:text-[22px]">{index + 1}</span>{" "}
          จาก {slides.length}
        </p>
        <div
          role="progressbar"
          aria-label="ความคืบหน้าสไลด์"
          aria-valuemin={1}
          aria-valuemax={slides.length}
          aria-valuenow={index + 1}
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-rule"
        >
          <div
            className="h-full rounded-full bg-pen transition-[width] duration-300"
            style={{ width: `${((index + 1) / slides.length) * 100}%` }}
          />
        </div>
        <div className="hidden gap-2.5 sm:flex">
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            disabled={isFirst}
            aria-label="สไลด์ก่อนหน้า"
            className={BUTTON_ICON}
          >
            <ChevronIcon direction="left" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex(index + 1)}
            disabled={isLast}
            aria-label="สไลด์ถัดไป"
            className={BUTTON_ICON}
          >
            <ChevronIcon direction="right" className="size-5" />
          </button>
        </div>
      </div>

      {/* key={index} = เปลี่ยนสไลด์แล้ว React สร้างการ์ดใหม่ → animation เล่นใหม่ทุกครั้ง */}
      <article
        key={index}
        aria-live="polite"
        className="animate-rise relative rounded-[14px] border-[1.5px] border-ink bg-card p-5 pt-8 shadow-[4px_4px_0_var(--ink)] sm:min-h-[420px] sm:px-16 sm:py-14 sm:shadow-[6px_6px_0_var(--ink)]"
      >
        <Tape />
        <h2 className="font-serif text-2xl leading-[1.35] font-bold sm:text-[38px] sm:leading-[1.3]">
          {slide.topicName}
        </h2>
        <ul className="mt-4 max-w-[46rem] space-y-3 leading-[1.7] sm:mt-7 sm:text-[19px]">
          {slide.details.map((detail, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="text-muted">
                •
              </span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid gap-x-4 sm:mt-6 md:grid-cols-2">
          {slide.keyTakeaways && <Callout title="จำง่าย ๆ" tone="hl" items={slide.keyTakeaways} />}
          {slide.examples && <Callout title="ตัวอย่าง" tone="plain" items={slide.examples} />}
          {slide.tips && <Callout title="ทริค" tone="pen" items={slide.tips} />}
        </div>
      </article>

      <nav className="flex gap-2.5 sm:hidden" aria-label="เลื่อนสไลด์">
        <button
          type="button"
          onClick={() => setIndex(index - 1)}
          disabled={isFirst}
          className={`${BUTTON_SECONDARY} flex-1`}
        >
          <ChevronIcon direction="left" className="size-[18px]" /> ก่อนหน้า
        </button>
        <button
          type="button"
          onClick={() => setIndex(index + 1)}
          disabled={isLast}
          className={`${BUTTON_PRIMARY} flex-1`}
        >
          ถัดไป <ChevronIcon direction="right" className="size-[18px]" />
        </button>
      </nav>
      <p className="-mt-2 hidden text-sm text-muted sm:block">กดปุ่มลูกศรซ้าย-ขวาบนคีย์บอร์ดเพื่อเปลี่ยนสไลด์ได้</p>

      <section className={SECTION_RULE}>
        <div className="flex items-baseline gap-3">
          <h2 className="font-serif text-[19px] font-bold sm:text-2xl">สไลด์ทั้งหมด</h2>
          <span className="text-[13px] text-muted sm:text-[15px]">
            <span className="sm:hidden">ปัดเพื่อดูเพิ่ม</span>
            <span className="hidden sm:inline">กดเพื่อข้ามไปสไลด์นั้น</span>
          </span>
        </div>
        {/* มือถือ = แถบเลื่อนแนวนอน · จอใหญ่ = ตาราง */}
        <ol
          ref={listRef}
          className="relative -mx-4 mt-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3.5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5"
        >
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <li key={i} className="w-[8.5rem] shrink-0 snap-start sm:w-auto">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={active ? "step" : undefined}
                  className={`h-full w-full rounded-lg p-3 text-left transition-colors sm:p-3.5 ${FOCUS} ${active ? "border-[1.5px] border-ink bg-hl/80" : "border border-rule bg-card hover:border-ink"}`}
                >
                  <span className={`block text-xs font-medium tabular-nums ${active ? "text-ink" : "text-pen"}`}>
                    {i + 1}
                  </span>
                  <span className="mt-1 line-clamp-3 block text-sm leading-snug font-semibold">{s.topicName}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
