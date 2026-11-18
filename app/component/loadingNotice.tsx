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
      className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
    >
      <Spinner className="size-5 shrink-0 text-accent" />
      <p className="text-sm">
        {message} <span className="text-muted tabular-nums">({seconds} วินาที)</span>
      </p>
    </div>
  );
}
