"use client";

import { Lecture, Status } from "@/types/summary";
import { useState } from "react";

export default function SummarizeButton({ file }: { file: File | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Lecture | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleUpload() {
    setStatus("loading");
    setErrorMessage("");

    if (!file) {
      setStatus("error");
      setErrorMessage("ไม่พบไฟล์ กรุณาเลือกไฟล์ใหม่");
      return;
    }

    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        // server ส่ง { error: "..." } กลับมา — แต่ถ้าอ่าน JSON ไม่ได้ก็ใช้ข้อความกลาง
        const body: { error?: string } = await res
          .json()
          .catch(() => ({}));
        setErrorMessage(body.error ?? `อัพไม่สำเร็จ (รหัส ${res.status})`);
        setStatus("error");
        return;
      }
      const data: Lecture = await res.json();
      setResult(data);
      setStatus("done");
    } catch {
      // fetch พังเอง = ติดต่อ server ไม่ได้เลย (server ปิด / เน็ตหลุด)
      setErrorMessage("ติดต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง");
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        onClick={handleUpload}
        disabled={status === "loading"}
        className="bg-cyan-700 w-100"
      >
        {status === "loading" ? "กำลังอัพ..." : "อัพโหลด"}
      </button>
      {status === "error" && <p className="text-red-400">{errorMessage}</p>}
      {status === "done" && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
