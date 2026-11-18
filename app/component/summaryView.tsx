"use client";

import { useState } from "react";
import type { Lecture } from "@/types/summary";
import { BulletView } from "./bulletView";
import { ExportButton } from "./exportButton";
import { FileIcon, RefreshIcon } from "./icons";
import { SlideView } from "./slideView";
import { BUTTON_SECONDARY, CARD } from "./styles";

type Tab = "bullets" | "slides";

const TABS: { id: Tab; icon: string; label: string; hint: string }[] = [
  { id: "bullets", icon: "📝", label: "โน้ตทบทวน", hint: "จุดที่น่าจะออกสอบ + คำศัพท์" },
  { id: "slides", icon: "🎞️", label: "สไลด์อธิบาย", hint: "อธิบายใหม่ทีละหัวข้อ" },
];

export function SummaryView({
  lecture,
  fileName,
  onReset,
}: {
  lecture: Lecture;
  fileName: string;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<Tab>("bullets");
  const termCount = lecture.bullets.reduce(
    (sum, bullet) => sum + (bullet.technicalTerms?.length ?? 0),
    0,
  );

  const stats = [
    { value: lecture.bullets.length, label: "หัวข้อทบทวน" },
    { value: lecture.slides.length, label: "สไลด์" },
    { value: termCount, label: "คำศัพท์" },
  ];

  return (
    <div>
      <header className={`${CARD} animate-rise relative overflow-hidden p-6 sm:p-8`}>
        {/* วงแสงตกแต่งมุมขวา */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-linear-to-br from-accent/25 to-accent-2/25 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
              <FileIcon className="size-3.5 shrink-0" />
              <span className="truncate">{fileName}</span>
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">{lecture.name}</h2>
          </div>
          <div className="flex shrink-0 flex-wrap items-start gap-2">
            <button type="button" onClick={onReset} className={BUTTON_SECONDARY}>
              <RefreshIcon className="size-4" /> สรุปไฟล์ใหม่
            </button>
            <ExportButton lecture={lecture} />
          </div>
        </div>

        <dl className="relative mt-6 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            // flex-col-reverse: ใน HTML ให้ dt (ชื่อ) มาก่อน dd (ค่า) ตามหลัก แต่บนจอโชว์ตัวเลขไว้บน
            <div
              key={stat.label}
              className="flex flex-col-reverse rounded-xl border border-border bg-surface-2/60 px-4 py-3"
            >
              <dt className="text-xs text-muted">{stat.label}</dt>
              <dd className="bg-linear-to-r from-accent to-accent-2 bg-clip-text text-2xl font-bold text-transparent tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div
        role="tablist"
        className="mt-6 grid grid-cols-2 gap-1.5 rounded-2xl border border-border bg-surface p-1.5 shadow-sm"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 sm:px-4 ${active ? "bg-linear-to-r from-brand to-brand-2 text-on-accent shadow-md shadow-accent/30" : "text-muted hover:bg-accent-soft hover:text-accent"}`}
            >
              <span className="text-xl" aria-hidden>
                {t.icon}
              </span>
              <span>
                <span className="block font-semibold">{t.label}</span>
                <span className={`hidden text-xs sm:block ${active ? "text-white/80" : ""}`}>
                  {t.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "bullets" ? (
          <BulletView bullets={lecture.bullets} />
        ) : (
          <SlideView slides={lecture.slides} />
        )}
      </div>
    </div>
  );
}
