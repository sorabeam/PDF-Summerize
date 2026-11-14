"use client";

import { Lecture, Status } from "@/types/summary";
import { useState } from "react";

export default function SummarizeButton({ file }: { file: File | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Lecture | null>(null);

  async function handleUpload() {
    setStatus("loading");

    if (!file) {
      setStatus("error");
      console.error("404 not found");
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
        setStatus("error");
        return;
      }
      const data: Lecture = await res.json();
      setResult(data);
      setStatus("done");
    } catch {
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
      {status === "error" && <p>อัพไม่สำเร็จ</p>}
      {status === "done" && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
