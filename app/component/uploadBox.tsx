"use client";

type FilePickerProps = {
  onPick: (file: File) => void;
};

export function UploadBox({ onPick }: FilePickerProps) {
  return (
    <div className="flex flex-col w-100">
      <div className="bg-cyan-900 items-center">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files !== null && e.target.files[0] !== null) {
              onPick(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
}
