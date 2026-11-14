"use client";

import { useState } from "react";

export function DisplayBox({ file }: { file: File | null }) {
  const [isDisplayAllowed, setVission] = useState<boolean>(false); //ทำตามโจทย์ที่ต้องกดปุ่มก่อน
  const display = checkValidation(file, isDisplayAllowed);

  return (
    <div className="flex flex-row gap-2 w-100 justify-center">
      <div className="bg-cyan-700 text-center w-full">
        <button onClick={() => setVission(true)}> กดเพื่อแสดงผล </button>
      </div>
      <div
        className={`${!display.ok ? "bg-red-900" : "bg-cyan-900"} text-center w-full`}
      >
        <p> {display.message} </p>
      </div>
      {display.ok && (
        <button onClick={() => console.log(file)}>สรุปไฟล์</button>
      )}
    </div>
  );
}

function checkValidation(file: File | null, isDisplayAllowed: boolean) {
  if (!isDisplayAllowed) {
    return { ok: false, message: "กรุณาอัพโหลดไฟล์" };
  }
  if (file === null || file === undefined) {
    return { ok: false, message: "ไม่พบไฟล์" };
  }
  if (file.type !== "application/pdf") {
    return { ok: false, message: "ชนิดของไฟล์ไม่ถูกต้อง" };
  }
  if (file.size < 0 || file.size / 1024 ** 2 >= 10) {
    return { ok: false, message: "ขนาดไฟล์ไม่ถูกต้อง (> 0 และ ≤ 10 MB)" };
  }
  return {
    ok: true,
    message:
      "File : " +
      file.name +
      " With Size : " +
      (file.size / 1024 ** 2).toFixed(2) +
      " MB",
  };
}
