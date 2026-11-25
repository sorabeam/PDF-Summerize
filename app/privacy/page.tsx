import type { Metadata } from "next";
import Link from "next/link";
import { DAILY_SUMMARY_LIMIT } from "@/lib/constants";

// หน้านโยบายความเป็นส่วนตัว — Google บังคับให้มีลิงก์นี้ก่อนเปิด login ให้ทุกคนใช้ (Publish app)
// เป็น server component ธรรมดา ไม่มี state → Next สร้างเป็นหน้า static ให้เลย

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว — PDF Summarizer",
};

const UPDATED = "25 พฤศจิกายน 2569";
const REPO_URL = "https://github.com/sorabeam/PDF-Summerize";

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "ข้อมูลที่เราเก็บ",
    items: [
      "เมื่อเข้าสู่ระบบด้วย Google เราได้รับชื่อ อีเมล รูปโปรไฟล์ และรหัสบัญชี Google ของคุณ ชื่อและอีเมลใช้แสดงบนหน้าเว็บเท่านั้น และเก็บไว้ในคุกกี้ที่เข้ารหัสบนเบราว์เซอร์ของคุณ",
      "ผลสรุปของแต่ละไฟล์ (ชื่อไฟล์ ชื่อเรื่อง โน้ตทบทวน สไลด์ คำศัพท์ และเวลาที่สรุป) เก็บในฐานข้อมูลโดยผูกกับรหัสบัญชี Google ของคุณ เพื่อให้เปิดอ่านย้อนหลังได้",
      "เราไม่เก็บไฟล์ PDF ที่คุณอัปโหลด",
    ],
  },
  {
    title: "ไฟล์ PDF ถูกส่งไปที่ไหน",
    items: [
      "ระหว่างสรุป ไฟล์ PDF ถูกส่งไปยัง Claude API ของ Anthropic เพื่ออ่านและเรียบเรียงเนื้อหา ตามนโยบายของ Anthropic (anthropic.com/legal/privacy)",
      "อย่าอัปโหลดเอกสารที่มีข้อมูลส่วนตัวหรือความลับที่ไม่อยากให้ระบบภายนอกประมวลผล",
    ],
  },
  {
    title: "เราใช้ข้อมูลทำอะไร",
    items: [
      "แสดงประวัติผลสรุปของคุณให้คุณคนเดียวเห็น ผู้ใช้คนอื่นเปิดดูไม่ได้",
      `จำกัดการใช้งานไม่เกิน ${DAILY_SUMMARY_LIMIT} ไฟล์ต่อคนต่อ 24 ชั่วโมง`,
      "เราไม่ขาย ไม่แชร์ และไม่ใช้ข้อมูลของคุณเพื่อโฆษณา",
    ],
  },
  {
    title: "ผู้ให้บริการที่เกี่ยวข้อง",
    items: [
      "Google: เข้าสู่ระบบ",
      "Anthropic: ประมวลผลและสรุปเอกสาร",
      "Vercel: โฮสต์เว็บไซต์",
      "Neon: ฐานข้อมูลเก็บประวัติผลสรุป",
    ],
  },
  {
    title: "การลบข้อมูล",
    items: [
      "ลบผลสรุปแต่ละรายการได้เองจากรายการ \"สรุปที่เคยทำ\" ข้อมูลจะถูกลบออกจากฐานข้อมูลทันที",
      "กดออกจากระบบเพื่อลบคุกกี้เข้าสู่ระบบออกจากเบราว์เซอร์",
      "ยกเลิกสิทธิ์ที่ให้แอปนี้ได้ที่ myaccount.google.com/permissions",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="w-full flex-1 px-4 py-10 sm:pr-10 sm:pl-24 sm:py-16">
      <article className="mx-auto max-w-[44rem]">
        <Link href="/" className="text-[15px] font-medium text-pen underline-offset-4 hover:underline">
          กลับหน้าแรก
        </Link>
        <h1 className="mt-6 font-serif text-[30px] leading-snug font-bold sm:text-[40px]">นโยบายความเป็นส่วนตัว</h1>
        <p className="mt-2 text-muted">PDF Summarizer · ปรับปรุงล่าสุด {UPDATED}</p>

        {SECTIONS.map((section) => (
          <section key={section.title} className="mt-9">
            <h2 className="font-serif text-xl font-bold sm:text-2xl">{section.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-[1.75] marker:text-muted">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-9">
          <h2 className="font-serif text-xl font-bold sm:text-2xl">ติดต่อเรา</h2>
          <p className="mt-3 leading-[1.75]">
            มีคำถามหรือต้องการให้ลบข้อมูลทั้งหมด เปิด issue ได้ที่{" "}
            <a href={`${REPO_URL}/issues`} className="font-medium text-pen underline underline-offset-4">
              GitHub ของโปรเจกต์
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
