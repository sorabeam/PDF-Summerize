import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist ไม่มีตัวอักษรไทย → เพิ่มฟอนต์ไทยไว้ให้ browser ใช้แทน
const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: "PDF Summarizer — สรุปเอกสารสำหรับอ่านสอบ",
  description:
    "อัพโหลด PDF แล้วได้โน้ตทบทวนก่อนสอบ + สไลด์อธิบายเนื้อหาแบบเข้าใจง่าย",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${notoThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
