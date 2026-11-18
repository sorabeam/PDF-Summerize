"use client";

import { useState } from "react";
import { getFileError } from "@/lib/fileCheck";
import { requestSummary } from "@/lib/requestSummary";
import type { Lecture, Status } from "@/types/summary";
import { FileIcon } from "./icons";
import { LoadingNotice } from "./loadingNotice";
import { SummaryView } from "./summaryView";
import { UploadBox } from "./uploadBox";

const STEPS = [
  { title: "อัพโหลด PDF", text: "ชีท สไลด์อาจารย์ หรือหนังสือ (ไม่เกิน 100 หน้า)" },
  { title: "รอสรุป 1–3 นาที", text: "AI อ่านทั้งไฟล์ แล้วเรียบเรียงใหม่ให้เข้าใจง่าย" },
  { title: "อ่าน + ดาวน์โหลด", text: "โน้ตทบทวน สไลด์อธิบาย และไฟล์ .pptx" },
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
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
          <FileIcon className="size-6 text-accent" />
          <span className="font-semibold">PDF Summarizer</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-12">
        {status === "done" && lecture && file ? (
          <SummaryView lecture={lecture} fileName={file.name} onReset={handleReset} />
        ) : (
          <section className="mx-auto max-w-xl">
            <h1 className="text-center text-3xl font-semibold leading-tight sm:text-4xl">
              อ่านสอบให้ไวขึ้นด้วย
              <br />
              <span className="text-accent">โน้ตสรุปจาก PDF</span>
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
                className="rounded-full bg-accent px-6 py-3 font-medium text-on-accent hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
              >
                {status === "loading" ? "กำลังสรุป..." : "สรุปเลย"}
              </button>

              {status === "loading" && <LoadingNotice />}

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-xl border border-danger bg-danger-soft px-4 py-3 text-sm text-danger"
                >
                  {errorMessage}
                </p>
              )}
            </div>

            <ol className="mt-12 grid gap-3 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title} className="rounded-xl border border-border bg-surface p-4">
                  <span className="text-sm font-semibold text-accent">{i + 1}</span>
                  <p className="mt-1 font-medium">{step.title}</p>
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
