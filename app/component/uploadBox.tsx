"use client";
import { useState } from "react";

export function UploadBox() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-cyan-900 items-center">
        <input
          id="InPutFile"
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files !== null) {
              setFile(e.target.files[0]);
            } else {
              setFile(null);
            }
          }}
        />
      </div>

      <div className="bg-cyan-700 text-center">
        <button
          onClick={() => {
            if (file != null) {
              console.log(
                file.name,
                (file.size / 1024 ** 2).toFixed(2) + " MB",
              );
            } else {
              console.warn("not selected file (must be PDF)");
            }
          }}
        >
          <p>อ่านข้อมูลไฟล์</p>
        </button>
      </div>
    </div>
  );
}
