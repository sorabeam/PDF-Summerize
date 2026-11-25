"use client";

import { useEffect, useState } from "react";
import { formatFileSize } from "@/lib/fileCheck";
import { FileIcon, PenIcon, Spinner, Tape } from "./icons";
import { BUTTON_SECONDARY, PAPER_CARD } from "./styles";

// 75 วินาที → "1:15"
function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// หน้ารอ Claude สรุป (1–3 นาที)
// server ยิง bullets กับ slides พร้อมกัน (Promise.all) → เราไม่รู้ว่าเสร็จไปกี่ % จริง ๆ
// จึงใช้แถบวิ่งวน (indeterminate) + นาฬิกา แทนการแต่งเปอร์เซ็นต์ขึ้นมาเอง
export function LoadingCard({ file, onCancel }: { file: File; onCancel: () => void }) {
  const [seconds, setSeconds] = useState(0);

  // useEffect + cleanup: ตั้งนาฬิกาตอนโผล่ · เก็บกวาดตอนหายไป (ไม่งั้นนาฬิกาเดินต่อ)
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const hint =
    seconds < 90
      ? "ปกติใช้เวลาประมาณ 1–2 นาที เปิดหน้านี้ค้างไว้ได้เลย เสร็จแล้วผลลัพธ์จะขึ้นมาเอง"
      : "ไฟล์นี้ยาวหน่อย อาจใช้เวลาถึง 3 นาที อย่าเพิ่งปิดหน้านี้";

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-8">
      <section role="status" aria-live="polite" className={`${PAPER_CARD} p-6 pt-8 sm:p-12`}>
        <Tape />

        <div className="flex items-center gap-3 rounded-lg border border-rule bg-card px-3.5 py-2.5">
          <FileIcon className="size-5 shrink-0" />
          <span className="min-w-0 flex-1 truncate font-semibold">{file.name}</span>
          <span className="shrink-0 text-sm text-muted">{formatFileSize(file.size)}</span>
        </div>

        <h1 className="mt-6 font-serif text-[26px] leading-snug font-bold sm:text-[34px]">
          กำลังสรุปชีทของคุณ
        </h1>
        <p className="mt-2 leading-relaxed text-muted sm:text-[17px]">{hint}</p>

        <div className="mt-6">
          <div className="h-1.5 overflow-hidden rounded-full bg-rule">
            <div className="animate-sweep h-full w-[28%] translate-x-[60%] rounded-full bg-pen" />
          </div>
          <p className="mt-2 text-sm font-medium tabular-nums">ผ่านไป {formatElapsed(seconds)}</p>
        </div>

        <div className="mt-6">
          <p className="text-[15px] font-semibold text-muted">กำลังเขียนพร้อมกัน 2 ส่วน</p>
          <ul className="mt-3 space-y-2.5">
            {["โน้ตทบทวนและคลังคำศัพท์", "สไลด์อธิบายเนื้อหาใหม่"].map((task) => (
              <li key={task} className="flex items-center gap-3 font-medium">
                <Spinner className="size-[18px] text-pen" />
                {task}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex flex-col-reverse items-stretch gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-sm text-muted sm:text-left">ยกเลิกแล้วจะกลับไปหน้าเลือกไฟล์</p>
          <button type="button" onClick={onCancel} className={BUTTON_SECONDARY}>
            ยกเลิกการสรุป
          </button>
        </div>
      </section>

      {/* active recall: นึกเองก่อนอ่านโน้ต ช่วยให้จำได้นานกว่าอ่านอย่างเดียว */}
      <p className="flex gap-3 px-1 text-[15px] leading-relaxed text-muted">
        <PenIcon className="mt-1 size-[18px] shrink-0 text-pen" />
        ระหว่างรอ ลองเขียนหัวข้อที่จำได้จากชีทนี้สัก 3 ข้อ แล้วเอาไปเทียบกับโน้ตที่ได้
        จะจำแม่นกว่าอ่านอย่างเดียว
      </p>
    </div>
  );
}
