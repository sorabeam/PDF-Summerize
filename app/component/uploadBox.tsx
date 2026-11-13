"use client";
import { useState } from "react";

export function UploadBox() {
  const [file, setFile] = useState<FileList | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-cyan-900 items-center">
        <input
          id="InPutFile"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files)}
        />
      </div>

      <div className="bg-cyan-700 text-center">
        <button
          onClick={() => {
            if (file != null) {
              console.log(
                file[0].name,
                (file[0].size / 1024 ** 2).toFixed(2) + " MB",
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
