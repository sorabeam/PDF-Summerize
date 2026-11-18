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

  // สีกล่องเปลี่ยนตามสถานะ: ผิด = แดง · ลากอยู่ = ม่วงเข้ม ขยายนิดนึง · มีไฟล์ = ขอบม่วง · ปกติ = ชี้แล้วเรือง
  const stateStyle = error
    ? "border-danger bg-danger-soft"
    : isDragging
      ? "scale-[1.02] border-accent bg-accent-soft shadow-xl shadow-accent/20"
      : file
        ? "border-accent/60 bg-surface shadow-lg shadow-accent/10"
        : "border-accent/30 bg-surface hover:border-accent hover:bg-accent-soft/50 hover:shadow-xl hover:shadow-accent/15";

  return (
    <div>
      {/* <label> ห่อ <input> ไว้ → คลิกตรงไหนของกล่องก็เปิดหน้าต่างเลือกไฟล์ */}
      <label
        className={`group flex cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 focus-within:ring-4 focus-within:ring-accent/30 ${stateStyle} ${disabled ? "pointer-events-none opacity-60" : ""}`}
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
            <span
              className={`grid size-16 place-items-center rounded-2xl shadow-lg ${error ? "bg-danger text-white shadow-danger/30" : "bg-linear-to-br from-brand to-brand-2 text-white shadow-accent/30"}`}
            >
              <FileIcon className="size-8" />
            </span>
            <div>
              <p className="font-semibold break-all">{file.name}</p>
              <p className="text-sm text-muted">{formatFileSize(file.size)}</p>
            </div>
            <span className="rounded-full border border-accent/30 px-3 py-1 text-sm font-medium text-accent transition-colors group-hover:bg-accent group-hover:text-on-accent">
              เปลี่ยนไฟล์
            </span>
          </>
        ) : (
          <>
            <span className="grid size-16 place-items-center rounded-2xl bg-accent-soft text-accent transition-all duration-200 group-hover:-translate-y-1 group-hover:bg-linear-to-br group-hover:from-brand group-hover:to-brand-2 group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/30">
              <UploadIcon className="size-8" />
            </span>
            <div>
              <p className="font-semibold">ลากไฟล์ PDF มาวางตรงนี้</p>
              <p className="text-sm text-muted">
                หรือ <span className="font-medium text-accent underline underline-offset-4">คลิกเพื่อเลือกไฟล์</span>
              </p>
            </div>
          </>
        )}
      </label>

      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-danger">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
