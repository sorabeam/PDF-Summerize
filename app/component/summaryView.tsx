"use client";

import { useState } from "react";
import type { Lecture } from "@/types/summary";
import { BulletView } from "./bulletView";
import { ExportButton } from "./exportButton";
import { RefreshIcon } from "./icons";
import { SlideView } from "./slideView";

type Tab = "bullets" | "slides";

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: "bullets", label: "โน้ตทบทวน", hint: "จุดที่น่าจะออกสอบ + คำศัพท์" },
  { id: "slides", label: "สไลด์อธิบาย", hint: "อธิบายใหม่ทีละหัวข้อ" },
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

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted">สรุปจาก {fileName}</p>
          <h2 className="mt-1 text-2xl font-semibold leading-snug sm:text-3xl">
            {lecture.name}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {lecture.bullets.length} หัวข้อ · {lecture.slides.length} สไลด์ · {termCount} คำศัพท์
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-start gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-accent"
          >
            <RefreshIcon className="size-4" /> สรุปไฟล์ใหม่
          </button>
          <ExportButton lecture={lecture} />
        </div>
      </header>

      <div
        role="tablist"
        className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-border bg-surface-2 p-1"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-3 py-2.5 text-left transition-colors sm:px-4 ${tab === t.id ? "bg-surface shadow-sm" : "text-muted hover:text-foreground"}`}
          >
            <span className="block font-medium">{t.label}</span>
            <span className="hidden text-xs text-muted sm:block">{t.hint}</span>
          </button>
        ))}
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
