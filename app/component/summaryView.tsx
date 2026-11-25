"use client";

import { useState } from "react";
import type { Lecture } from "@/types/summary";
import { BulletView } from "./bulletView";
import { ExportButton } from "./exportButton";
import { FileIcon, ListIcon, SlidesIcon } from "./icons";
import { SlideView } from "./slideView";
import { FOCUS } from "./styles";

type Tab = "bullets" | "slides";

const TABS = [
  { id: "bullets" as const, Icon: ListIcon, label: "โน้ตทบทวน" },
  { id: "slides" as const, Icon: SlidesIcon, label: "สไลด์อธิบาย" },
];

export function SummaryView({ lecture, fileName }: { lecture: Lecture; fileName: string }) {
  const [tab, setTab] = useState<Tab>("bullets");
  const termCount = lecture.bullets.reduce(
    (sum, bullet) => sum + (bullet.technicalTerms?.length ?? 0),
    0,
  );

  const stats = [
    { value: lecture.bullets.length, label: "หัวข้อ" },
    { value: lecture.slides.length, label: "สไลด์" },
    { value: termCount, label: "คำศัพท์" },
  ];

  return (
    <div className="pt-2 sm:pt-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[13px] text-muted sm:text-[15px]">
            <FileIcon className="size-4 shrink-0" />
            <span className="truncate">{fileName}</span>
          </p>
          <h1 className="mt-2 font-serif text-[26px] leading-[1.35] font-bold sm:text-[40px]">{lecture.name}</h1>
          <dl className="mt-2 flex flex-wrap gap-x-7 gap-y-1">
            {stats.map((stat) => (
              // flex-row-reverse: ใน HTML ให้ dt (ชื่อ) มาก่อน dd (ค่า) ตามหลัก แต่บนจอโชว์ตัวเลขก่อน
              <div key={stat.label} className="flex flex-row-reverse items-baseline justify-end gap-1.5">
                <dt className="text-[15px] text-muted">{stat.label}</dt>
                <dd className="font-serif text-xl font-bold tabular-nums sm:text-[22px]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ExportButton lecture={lecture} />
      </header>

      {/* แท็บแบบแฟ้มเอกสาร: แท็บที่เลือกต่อเป็นเนื้อเดียวกับแผงด้านล่าง (ทับขอบแผงลงไป 1.5px) */}
      <div className="mt-8 sm:mt-9">
        <div role="tablist" aria-label="รูปแบบผลสรุป" className="relative z-10 flex gap-1.5">
          {TABS.map(({ id, Icon, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="summary-panel"
                onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-t-[10px] border-[1.5px] border-b-0 px-3 py-3 text-[15px] sm:flex-none sm:px-5 sm:text-base ${FOCUS} ${active ? "-mb-[1.5px] border-ink bg-paper font-semibold text-ink" : "border-rule bg-background font-medium text-muted hover:text-ink"}`}
              >
                <Icon className="size-[18px]" />
                {label}
              </button>
            );
          })}
        </div>
        <section
          id="summary-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="rounded-b-[12px] border-[1.5px] border-ink bg-paper px-4 py-5 sm:rounded-tr-[12px] sm:p-10"
        >
          {tab === "bullets" ? (
            <BulletView bullets={lecture.bullets} />
          ) : (
            <SlideView slides={lecture.slides} />
          )}
        </section>
      </div>
    </div>
  );
}
