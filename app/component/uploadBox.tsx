"use client";

import { useState } from "react";
import { formatFileSize } from "@/lib/fileCheck";
import { FileIcon, UploadIcon } from "./icons";

type UploadBoxProps = {
  file: File | null;
  error: string | null;
  disabled: boolean;
  onPick: (file: File | null) => void;
};

// กล่องเลือกไฟล์: คลิกเพื่อเลือก หรือ ลากไฟล์มาวาง (drag & drop)
export function UploadBox({ file, error, disabled, onPick }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);

  const borderColor = error
    ? "border-danger"
    : isDragging
      ? "border-accent bg-accent-soft"
      : "border-border hover:border-accent";

  return (
    <div>
      {/* <label> ห่อ <input> ไว้ → คลิกตรงไหนของกล่องก็เปิดหน้าต่างเลือกไฟล์ */}
      <label
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed bg-surface px-6 py-10 text-center transition-colors ${borderColor} ${disabled ? "pointer-events-none opacity-60" : ""}`}
        onDragOver={(e) => {
          e.preventDefault(); // ต้องมี ไม่งั้น browser จะเปิดไฟล์แทน
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onPick(e.dataTransfer.files[0] ?? null);
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            onPick(e.target.files?.[0] ?? null);
            e.target.value = ""; // เคลียร์ค่า → เลือกไฟล์เดิมซ้ำได้
          }}
        />

        {file ? (
          <>
            <FileIcon className="size-10 text-accent" />
            <div>
              <p className="font-medium break-all">{file.name}</p>
              <p className="text-sm text-muted">{formatFileSize(file.size)}</p>
            </div>
            <span className="text-sm text-accent underline underline-offset-4">
              เปลี่ยนไฟล์
            </span>
          </>
        ) : (
          <>
            <UploadIcon className="size-10 text-muted" />
            <div>
              <p className="font-medium">ลากไฟล์ PDF มาวางตรงนี้</p>
              <p className="text-sm text-muted">หรือคลิกเพื่อเลือกไฟล์</p>
            </div>
          </>
        )}
      </label>

      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
