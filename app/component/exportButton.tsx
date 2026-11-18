"use client";

import { useState } from "react";
import type { Lecture } from "@/types/summary";
import { DownloadIcon, Spinner } from "./icons";

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
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleExport}
        disabled={busy}
        className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-strong disabled:opacity-60"
      >
        {busy ? <Spinner className="size-4" /> : <DownloadIcon className="size-4" />}
        {busy ? "กำลังสร้างไฟล์..." : "ดาวน์โหลด .pptx"}
      </button>
      {failed && <p className="mt-1 text-xs text-danger">สร้างไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง</p>}
    </div>
  );
}
