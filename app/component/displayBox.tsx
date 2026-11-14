"use client";

import { useState } from "react";
import SummarizeButton from "./summarizeButton";

export function DisplayBox({ file }: { file: File | null }) {
  const [isDisplayAllowed, setIsDisplayAllowed] = useState<boolean>(false); //ทำตามโจทย์ที่ต้องกดปุ่มก่อน
  const display = checkValidation(file, isDisplayAllowed);

  return (
    <>
      <div className="flex flex-row gap-2 w-100 justify-center">
        <div className="bg-cyan-700 text-center w-full">
          <button onClick={() => setIsDisplayAllowed(true)}>
            กดเพื่อแสดงผล
          </button>
        </div>
        <div
          className={`${!display.ok && display.start ? "bg-red-900" : "bg-cyan-900"} text-center w-full`}
        >
          <p> {display.message} </p>
        </div>
      </div>
      {display.ok && <SummarizeButton file={file} />}
    </>
  );
}

function checkValidation(file: File | null, isDisplayAllowed: boolean) {
  if (!isDisplayAllowed) {
    return { ok: false, start: false, message: "กรุณาอัพโหลดไฟล์" };
  }
  if (file === null) {
    return { ok: false, start: true, message: "ไม่พบไฟล์" };
  }
  if (file.type !== "application/pdf") {
    return { ok: false, start: true, message: "ชนิดของไฟล์ไม่ถูกต้อง" };
  }
  if (file.size === 0 || file.size / 1024 ** 2 > 10) {
    return {
      ok: false,
      start: true,
      message: "ขนาดไฟล์ไม่ถูกต้อง (> 0 และ ≤ 10 MB)",
    };
  }
  return {
    ok: true,
    start: true,
    message:
      "File : " +
      file.name +
      " With Size : " +
      (file.size / 1024 ** 2).toFixed(2) +
      " MB",
  };
}
