"use client";
import { useState } from "react";

export function DisplayBox({ file }: { file: File | null }) {
  const [displayText, setText] = useState<string>("");

  return (
    <div className="flex flex-row gap-2 w-100 justify-center">
      <div className="bg-cyan-700 text-center w-full">
        <button
          onClick={() => {
            if (file !== null && file !== undefined) {
              console.log(
                file.name,
                (file.size / 1024 ** 2).toFixed(2) + " MB",
              );
              if (file.type == "application/pdf" && file.size > 0) {
                setText(
                  "File : " +
                    file.name +
                    "With Size : " +
                    (file.size / 1024 ** 2).toFixed(2) +
                    " MB",
                );
              } else {
                setText("กรุณาอัพโหลดไฟล์ที่ถูกต้อง");
              }
            } else {
              setText("กรุณาอัพโหลดไฟล์ที่ถูกต้อง");
            }
          }}
        >
          <p>กดเพื่อแสดงผล</p>
        </button>
      </div>

      <div
        className={`${displayText !== "กรุณาอัพโหลดไฟล์ที่ถูกต้อง" ? "bg-cyan-900" : "bg-red-700"} text-center w-full `}
      >
        {(((file !== null && file !== undefined) || displayText.length > 0) &&
          displayText) || <p>กรุณาอัพโหลดไฟล์</p>}
      </div>
    </div>
  );
}
