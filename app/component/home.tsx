"use client";

import { useState } from "react";
import { getFileError } from "@/lib/fileCheck";
import { requestSummary } from "@/lib/requestSummary";
import type { Lecture, Status } from "@/types/summary";
import { FileIcon } from "./icons";
import { LoadingNotice } from "./loadingNotice";
import { BUTTON_PRIMARY, CARD_HOVER, colorAt } from "./styles";
import { SummaryView } from "./summaryView";
import { UploadBox } from "./uploadBox";

const STEPS = [
  { icon: "📄", title: "อัพโหลด PDF", text: "ชีท สไลด์อาจารย์ หรือหนังสือ (ไม่เกิน 100 หน้า)" },
  { icon: "⏳", title: "รอสรุป 1–3 นาที", text: "AI อ่านทั้งไฟล์ แล้วเรียบเรียงใหม่ให้เข้าใจง่าย" },
  { icon: "🎯", title: "อ่าน + ดาวน์โหลด", text: "โน้ตทบทวน สไลด์อธิบาย และไฟล์ .pptx" },
];

export function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // derived state: ไม่ต้องเก็บใน useState เพราะคำนวณจาก file ได้ทุกครั้ง
  const fileError = file ? getFileError(file) : null;
  const canSubmit = file !== null && fileError === null && status !== "loading";

  function handlePick(picked: File | null) {
    setFile(picked);
    setStatus("idle");
    setErrorMessage("");
  }

  async function handleSummarize() {
    if (!file || fileError) return;
    setStatus("loading");
    setErrorMessage("");
    try {
      setLecture(await requestSummary(file));
      setStatus("done");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      setStatus("error");
    }
  }

  function handleReset() {
    setFile(null);
    setLecture(null);
    setStatus("idle");
    setErrorMessage("");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-3">
          <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-brand to-brand-2 text-white shadow-md shadow-accent/30">
            <FileIcon className="size-5" />
          </span>
          <span className="font-bold">
            PDF <span className="bg-linear-to-r from-accent to-accent-2 bg-clip-text text-transparent">Summarizer</span>
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
        {status === "done" && lecture && file ? (
          <SummaryView lecture={lecture} fileName={file.name} onReset={handleReset} />
        ) : (
          <section className="mx-auto max-w-xl">
            <p className="mx-auto w-fit rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              ✨ ตัวช่วยอ่านหนังสือสอบด้วย AI
            </p>
            <h1 className="mt-4 text-center text-3xl font-bold leading-tight sm:text-5xl sm:leading-tight">
              อ่านสอบให้ไวขึ้นด้วย
              <br />
              <span className="bg-linear-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                โน้ตสรุปจาก PDF
              </span>
            </h1>
            <p className="mt-3 text-center text-muted">
              อัพโหลดเอกสาร แล้วรับโน้ตทบทวนก่อนสอบ + สไลด์อธิบายเนื้อหาแบบมือใหม่เข้าใจ
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <UploadBox
                file={file}
                error={fileError}
                disabled={status === "loading"}
                onPick={handlePick}
              />

              <button
                type="button"
                onClick={handleSummarize}
                disabled={!canSubmit}
                className={`${BUTTON_PRIMARY} py-3.5 text-lg`}
              >
                {status === "loading" ? "กำลังสรุป..." : "✨ สรุปเลย"}
              </button>

              {status === "loading" && <LoadingNotice />}

              {status === "error" && (
                <p
                  role="alert"
                  className="animate-rise rounded-xl border border-danger/50 bg-danger-soft px-4 py-3 text-sm font-medium text-danger shadow-sm"
                >
                  {errorMessage}
                </p>
              )}
            </div>

            <ol className="mt-14 grid gap-4 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className={`${CARD_HOVER} relative overflow-hidden p-5`}>
                  <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${colorAt(i).bar}`} />
                  <span
                    className={`grid size-10 place-items-center rounded-xl text-xl ${colorAt(i).badge}`}
                    aria-hidden
                  >
                    {step.icon}
                  </span>
                  <p className="mt-3 font-semibold">
                    {i + 1}. {step.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-muted">
        สรุปโดย AI อาจมีผิดพลาด ตรวจกับเอกสารต้นฉบับก่อนสอบเสมอ
      </footer>
    </div>
  );
}
