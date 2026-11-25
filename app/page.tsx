import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
import { HomePage } from "./component/home";

// โปรเจกต์นี้เปิด cacheComponents (next.config.ts) → Next พยายามสร้างหน้านี้ไว้ล่วงหน้าตอน build
// แต่ auth() ต้องอ่านคุกกี้ของคนที่เปิดเว็บ ซึ่งตอน build ยังไม่มี
// → แยกส่วนที่อ่านคุกกี้ไปไว้ใน <Suspense> : Next สร้าง fallback ไว้ก่อน แล้วค่อยเติม (stream) ตอนมีคนเปิดจริง
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <HomeWithUser />
    </Suspense>
  );
}

async function HomeWithUser() {
  // connection() = บอก Next ว่า "ส่วนนี้ทำตอนมีคนเปิดเว็บจริงเท่านั้น" ห้ามสร้างล่วงหน้า
  // ต้องมี เพราะ auth() สุ่มตัวเลข (crypto) ก่อนอ่านคุกกี้ → Next เตือนว่าค่าเปลี่ยนทุกครั้ง
  await connection();
  const mockMode = process.env.USE_MOCK === "1";
  const session = mockMode ? null : await auth();
  const user = session?.user ? { name: session.user.name ?? session.user.email ?? "ผู้ใช้" } : null;

  return <HomePage user={user} mockMode={mockMode} />;
}
