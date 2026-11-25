import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Noto_Serif, Noto_Serif_Thai } from "next/font/google";
import "./globals.css";

// เนื้อหา/ปุ่ม: IBM Plex Sans Thai มีทั้งตัวไทยและอังกฤษในตัวเดียว (ฟอนต์นี้ไม่ใช่ variable → ต้องบอก weight)
const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

// หัวข้อ: Noto Serif Thai (ตัวไทย) + Noto Serif (ตัวอังกฤษ/ตัวเลข) — ประกอบกันใน globals.css (--font-serif)
const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai"],
  weight: ["600", "700"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
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
      className={`${plexThai.variable} ${notoSerifThai.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
