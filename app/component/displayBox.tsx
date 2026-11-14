"use client";

export function DisplayBox({ file }: { file: File | null }) {
  const displayText = checkValidation(file);

  return (
    <div className="flex flex-row gap-2 w-100 justify-center">
      <div className="bg-cyan-700 text-center w-full">
        <button> กดเพื่อแสดงผล </button>
      </div>
      <div
        className={`${file && file?.type != "application/pdf" ? "bg-red-900" : "bg-cyan-900"} text-center w-full`}
      >
        <p> {displayText} </p>
      </div>
    </div>
  );
}

function checkValidation(file: File | null) {
  if (file == null || file == undefined) {
    return "กรุณาอัพโหลดไฟล์";
  }
  if (file.type != "application/pdf") {
    return "กรุณาอัพโหลดไฟล์ ที่ถูกต้อง";
  }
  return (
    "File : " +
    file.name +
    "With Size : " +
    (file.size / 1024 ** 2).toFixed(2).toString() +
    " MB"
  );
}
