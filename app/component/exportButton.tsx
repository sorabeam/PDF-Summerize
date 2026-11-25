"use client";

import { useState } from "react";
import type { Lecture } from "@/types/summary";
import { DownloadIcon, Spinner } from "./icons";
import { BUTTON_PRIMARY } from "./styles";

// ปุ่มดาวน์โหลด .pptx — สร้างไฟล์ในเบราว์เซอร์เลย ไม่ต้องส่งไป server
export function ExportButton({ lecture }: { lecture: Lecture }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleExport() {
    setBusy(true);
    setFailed(false);
    try {
      // import แบบ dynamic = โหลดโค้ดทำ pptx (ใหญ่) ตอนกดปุ่มเท่านั้น หน้าเว็บแรกจะได้โหลดเร็ว
      const { exportLectureToPptx } = await import("@/lib/exportPptx");
      await exportLectureToPptx(lecture);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-stretch lg:items-end">
      <button type="button" onClick={handleExport} disabled={busy} className={BUTTON_PRIMARY}>
        {busy ? <Spinner className="size-[18px]" /> : <DownloadIcon className="size-[18px]" />}
        {busy ? "กำลังสร้างไฟล์..." : "ดาวน์โหลดสไลด์ .pptx"}
      </button>
      {failed && (
        <p role="alert" className="mt-2 text-sm text-danger">
          สร้างไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง
        </p>
      )}
    </div>
  );
}
