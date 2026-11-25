"use client";

import { useId, useState } from "react";
import { MAX_FILE_SIZE_MB } from "@/lib/constants";
import { formatFileSize } from "@/lib/fileCheck";
import { FileIcon, Tape } from "./icons";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, PAPER_CARD } from "./styles";

type UploadCardProps = {
  file: File | null;
  fileError: string | null; // ไฟล์ผิดเงื่อนไข (ตรวจฝั่ง client)
  submitError: string; // สรุปไม่สำเร็จ (ข้อความจาก server)
  onPick: (file: File | null) => void;
  onSubmit: () => void;
};

// การ์ดกระดาษสำหรับเลือกไฟล์: ลากมาวาง หรือกดปุ่มเลือก → มีไฟล์แล้วค่อยกด "สรุปเลย"
export function UploadCard({ file, fileError, submitError, onPick, onSubmit }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  // useId = สร้าง id ที่ไม่ซ้ำ เอาไว้ผูก <label htmlFor> กับ <input> (ปุ่มกี่ปุ่มก็เปิดหน้าต่างเลือกไฟล์ได้)
  const inputId = useId();
  const canSubmit = file !== null && fileError === null;

  const dropStyle = fileError
    ? "border-danger bg-danger-soft"
    : isDragging
      ? "border-pen bg-pen-soft"
      : "border-muted/60 hover:border-ink hover:bg-pen-soft/40";

  return (
    <div className={`${PAPER_CARD} p-5 pt-8 sm:p-10 sm:pt-12`}>
      <Tape />

      <input
        id={inputId}
        type="file"
        accept="application/pdf"
        className="peer sr-only"
        onChange={(e) => {
          onPick(e.target.files?.[0] ?? null);
          e.target.value = ""; // เคลียร์ค่า → เลือกไฟล์เดิมซ้ำได้
        }}
      />

      <label
        htmlFor={inputId}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-[10px] border-[1.5px] border-dashed px-4 py-7 text-center transition-colors duration-150 peer-focus-visible:ring-[3px] peer-focus-visible:ring-pen sm:py-9 ${dropStyle}`}
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
        <FileIcon className={`size-9 ${fileError ? "text-danger" : "text-ink"}`} />
        {file ? (
          <>
            <span className="font-semibold break-all">{file.name}</span>
            <span className="text-sm text-muted">{formatFileSize(file.size)}</span>
          </>
        ) : (
          <>
            {/* มือถือลากไฟล์ไม่ได้ → เปลี่ยนข้อความตามขนาดจอ */}
            <span className="font-serif text-xl font-bold sm:text-2xl">
              <span className="sm:hidden">แตะเพื่อเลือกไฟล์ PDF</span>
              <span className="hidden sm:inline">วางไฟล์ PDF ที่นี่</span>
            </span>
            <span className="text-sm text-muted">
              <span className="sm:hidden">ไฟล์ .pdf ขนาดไม่เกิน {MAX_FILE_SIZE_MB} MB</span>
              <span className="hidden sm:inline">ลากมาวาง หรือกดปุ่มด้านล่าง</span>
            </span>
          </>
        )}
      </label>

      {fileError && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {fileError}
        </p>
      )}

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:items-center">
        {file ? (
          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button type="button" onClick={onSubmit} disabled={!canSubmit} className={BUTTON_PRIMARY}>
              สรุปเลย
            </button>
            <label htmlFor={inputId} className={`${BUTTON_SECONDARY} cursor-pointer`}>
              เปลี่ยนไฟล์
            </label>
          </div>
        ) : (
          <label htmlFor={inputId} className={`${BUTTON_PRIMARY} cursor-pointer`}>
            เลือกไฟล์ PDF
          </label>
        )}
        <p className="text-center text-[13px] text-muted">
          ไฟล์ .pdf ไม่เกิน {MAX_FILE_SIZE_MB} MB · สรุปเสร็จในราว 1–2 นาที
        </p>
      </div>

      {submitError && (
        <p
          role="alert"
          className="mt-5 rounded-[10px] border-[1.5px] border-danger bg-danger-soft px-4 py-3 text-sm font-medium text-danger"
        >
          {submitError}
        </p>
      )}
    </div>
  );
}
