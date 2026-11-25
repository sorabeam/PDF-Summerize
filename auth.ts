// ตั้งค่า login ด้วย Auth.js (next-auth v5) — ใช้ Google อย่างเดียว
// อ่านค่าจาก env เอง: AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
//
// session เก็บในคุกกี้ที่เข้ารหัสแล้ว (JWT) → ไม่ต้องมีตาราง users ในฐานข้อมูล
// ตัวระบุผู้ใช้ = token.sub (รหัสบัญชี Google ที่ไม่เปลี่ยน แม้เปลี่ยนชื่อ/อีเมล)

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    // ปกติ session.user มีแค่ name/email/image → เติม id เข้าไปให้ใช้แยกประวัติของแต่ละคน
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
