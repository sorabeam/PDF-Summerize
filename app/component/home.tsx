"use client";

import { useRef, useState } from "react";
import { getFileError } from "@/lib/fileCheck";
import { requestSummary } from "@/lib/requestSummary";
import type { Lecture, Status } from "@/types/summary";
import { CheckIcon, FileIcon, PlusIcon, SparkleIcon } from "./icons";
import { LoadingCard } from "./loadingNotice";
import { BUTTON_ICON, BUTTON_SECONDARY, FOCUS } from "./styles";
import { SummaryView } from "./summaryView";
import { UploadCard } from "./uploadBox";

const CHECKLIST = [
  "จุดที่น่าจะออกสอบ สรุปเป็นข้อ ๆ",
  "คลังคำศัพท์ + โหมดทดสอบตัวเอง",
  "สไลด์อธิบายใหม่ ดาวน์โหลดเป็น .pptx ได้",
];

// เป็นลำดับขั้นจริง → ใส่เลข 01 02 03 ได้
const STEPS = [
  { title: "อัปโหลดชีท", text: "ลากไฟล์ PDF มาวาง หรือกดเลือกไฟล์ ขนาดไม่เกิน 4 MB" },
  { title: "รอสรุปประมาณ 1–2 นาที", text: "ระบบอ่านทั้งไฟล์ แล้วแยกเป็นโน้ต คำศัพท์ และสไลด์" },
  { title: "อ่าน ทดสอบ แล้วโหลดเก็บ", text: "ทบทวนจากโน้ต ทดสอบคำศัพท์ หรือโหลดสไลด์เป็น .pptx" },
];

// ขอบซ้ายต้องเลยเส้นกั้นหน้าสีแดง (12px บนมือถือ · 72px บนจอใหญ่)
const PAGE_X = "w-full px-4 sm:pl-24 sm:pr-10";
const PAGE_INNER = "mx-auto w-full max-w-[1200px]";

export function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  // useRef = กล่องเก็บค่าที่ "ไม่ต้องวาดจอใหม่" เมื่อเปลี่ยน → เหมาะกับตัวยกเลิก fetch
  const abortRef = useRef<AbortController | null>(null);

  // derived state: ไม่ต้องเก็บใน useState เพราะคำนวณจาก file ได้ทุกครั้ง
  const fileError = file ? getFileError(file) : null;

  function handlePick(picked: File | null) {
    setFile(picked);
    setStatus("idle");
    setErrorMessage("");
  }

  async function handleSummarize() {
    if (!file || fileError) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");
    setErrorMessage("");
    try {
      setLecture(await requestSummary(file, controller.signal));
      setStatus("done");
    } catch (err) {
      if (controller.signal.aborted) return; // ผู้ใช้กดยกเลิกเอง ไม่ใช่ error
      setErrorMessage(err instanceof Error ? err.message : "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      setStatus("error");
    } finally {
      abortRef.current = null;
    }
  }

  function handleCancel() {
    abortRef.current?.abort(); // fetch โยน error → server ได้สัญญาณแล้วหยุดถาม Claude
    setStatus("idle"); // เก็บไฟล์ไว้ กด "สรุปเลย" ใหม่ได้ทันที
  }

  function handleReset() {
    setFile(null);
    setLecture(null);
    setStatus("idle");
    setErrorMessage("");
  }

  const isDone = status === "done" && lecture !== null && file !== null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className={PAGE_X}>
        <div className={`${PAGE_INNER} flex items-center justify-between gap-4 py-3.5 sm:py-7`}>
          <span className="flex items-center gap-2.5">
            <span className="grid size-[30px] place-items-center rounded-lg border-[1.5px] border-ink bg-hl sm:size-8">
              <FileIcon className="size-[18px] sm:size-5" />
            </span>
            <span className="font-serif text-[17px] font-bold sm:text-xl">PDF Summarizer</span>
          </span>

          {isDone ? (
            <>
              {/* ห่อด้วย span เพื่อซ่อน/แสดงตามจอ (ใส่ hidden ตรงปุ่มจะชนกับ inline-flex ในปุ่ม) */}
              <span className="hidden sm:block">
                <button type="button" onClick={handleReset} className={`${BUTTON_SECONDARY} text-[15px]`}>
                  <PlusIcon className="size-[18px]" /> สรุปไฟล์ใหม่
                </button>
              </span>
              <span className="sm:hidden">
                <button type="button" onClick={handleReset} aria-label="สรุปไฟล์ใหม่" className={BUTTON_ICON}>
                  <PlusIcon className="size-5" />
                </button>
              </span>
            </>
          ) : (
            status !== "loading" && (
              <a href="#how" className={`rounded text-[15px] font-medium text-muted hover:text-ink ${FOCUS}`}>
                วิธีใช้
              </a>
            )
          )}
        </div>
      </header>

      <main className={`${PAGE_X} flex-1 pb-16 sm:pb-24`}>
        <div className={PAGE_INNER}>
          {isDone ? (
            <SummaryView lecture={lecture} fileName={file.name} />
          ) : status === "loading" && file ? (
            <div className="pt-6 sm:pt-12">
              <LoadingCard file={file} onCancel={handleCancel} />
            </div>
          ) : (
            <>
              <section className="grid items-center gap-10 pt-3 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-16">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-pen-soft px-3.5 py-1.5 text-[13px] font-medium text-pen sm:text-[15px]">
                    <SparkleIcon className="size-3.5" />
                    สำหรับนักเรียนที่กำลังอ่านหนังสือสอบ
                  </p>
                  <h1 className="mt-5 font-serif text-[36px] leading-[1.3] font-bold sm:text-[60px] sm:leading-[1.25]">
                    เปลี่ยนชีทหนา ๆ
                    <br />
                    ให้เป็น{" "}
                    <mark className="inline-block -rotate-[1.5deg] rounded bg-hl px-2.5 text-ink">โน้ตย่อ</mark>
                  </h1>
                  <p className="mt-5 max-w-[34rem] leading-[1.65] text-muted sm:text-lg">
                    อัปโหลด PDF แล้วได้โน้ตทบทวน คำศัพท์ และสไลด์อธิบายใหม่
                    ภาษาที่อ่านแล้วเข้าใจตั้งแต่รอบแรก
                  </p>
                  <ul className="mt-6 space-y-3">
                    {CHECKLIST.map((item) => (
                      <li key={item} className="flex items-center gap-3 font-medium sm:text-[17px]">
                        <span className="grid size-5 shrink-0 place-items-center rounded border-[1.5px] border-pen text-pen">
                          <CheckIcon className="size-3.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <UploadCard
                  file={file}
                  fileError={fileError}
                  submitError={status === "error" ? errorMessage : ""}
                  onPick={handlePick}
                  onSubmit={handleSummarize}
                />
              </section>

              <section id="how" className="mt-16 scroll-mt-6 sm:mt-24">
                <h2 className="sr-only">วิธีใช้</h2>
                <ol className="grid gap-6 sm:grid-cols-3 sm:gap-10">
                  {STEPS.map((step, i) => (
                    <li key={step.title} className="border-t-[1.5px] border-ink pt-4 sm:pt-5">
                      <p className="text-sm font-medium text-pen tabular-nums">0{i + 1}</p>
                      <h3 className="mt-1.5 text-lg font-semibold sm:text-xl">{step.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{step.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}
        </div>
      </main>

      <footer className={`${PAGE_X} pb-8 text-center text-xs text-muted`}>
        สรุปโดย AI อาจมีผิดพลาด ตรวจกับเอกสารต้นฉบับก่อนสอบเสมอ
      </footer>
    </div>
  );
}
