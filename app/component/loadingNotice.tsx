"use client";

import { useEffect, useState } from "react";
import { Spinner } from "./icons";

// แสดงระหว่างรอ Claude สรุป (อาจนาน 1–3 นาที) — บอกเวลาที่ผ่านไปจะได้ไม่คิดว่าค้าง
export function LoadingNotice() {
  const [seconds, setSeconds] = useState(0);

  // useEffect = "ทำอะไรบางอย่างหลัง component โผล่บนจอ"
  // ที่นี่: ตั้งนาฬิกานับทุก 1 วิ · return = เก็บกวาดตอน component หายไป (ไม่งั้นนาฬิกาเดินต่อ)
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const message =
    seconds < 15
      ? "กำลังอ่าน PDF..."
      : seconds < 60
        ? "กำลังเขียนโน้ตทบทวนและสไลด์..."
        : "ไฟล์ยาวหน่อย อาจใช้เวลาถึง 2–3 นาที อย่าเพิ่งปิดหน้านี้นะ";

  return (
    <div
      role="status"
      className="animate-rise relative overflow-hidden rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Spinner className="size-5 shrink-0 text-accent" />
        <p className="text-sm font-medium">
          {message} <span className="font-normal text-muted tabular-nums">({seconds} วินาที)</span>
        </p>
      </div>
      {/* แถบวิ่ง ๆ ด้านล่าง ให้รู้ว่ายังทำงานอยู่ */}
      <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-linear-to-r from-accent to-accent-2" style={{ marginLeft: `${(seconds * 13) % 67}%`, transition: "margin-left 1s linear" }} />
      </div>
    </div>
  );
}
