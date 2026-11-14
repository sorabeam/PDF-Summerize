"use client";
import { useState } from "react";
import { DisplayBox } from "./displayBox";
import { UploadBox } from "./uploadBox";
import SummarizeButton from "./summarizeButton";

export function HomePage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className=" h-screen flex flex-col gap-2 items-center justify-center">
      <h1 className=" text-3xl "> PDF - Summarizer </h1>
      <p className=" text-cyan-700 "> อัพโหลดไฟล์เพื่อสรุป </p>

      <UploadBox onPick={setFile} />
      <DisplayBox file={file} />
    </div>
  );
}
