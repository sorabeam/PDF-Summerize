"use client";

import { useFormStatus } from "react-dom";
import { signInWithGoogle } from "@/app/actions";
import { GoogleIcon, Spinner, Tape } from "./icons";
import { BUTTON_SECONDARY, PAPER_CARD } from "./styles";

// useFormStatus = รู้ว่า <form> ที่ครอบปุ่มนี้กำลังส่งอยู่ไหม (ต้องอยู่ใน component ลูกของ form)
function GoogleButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${BUTTON_SECONDARY} w-full bg-card py-3 sm:w-auto sm:px-6`}>
      {pending ? <Spinner className="size-5" /> : <GoogleIcon className="size-5" />}
      เข้าสู่ระบบด้วย Google
    </button>
  );
}

// แสดงแทนการ์ดอัปโหลด เมื่อยังไม่ได้ login
export function LoginCard() {
  return (
    <div className={`${PAPER_CARD} p-6 pt-9 text-center sm:p-12`}>
      <Tape />
      <h2 className="font-serif text-[22px] leading-snug font-bold sm:text-[28px]">เข้าสู่ระบบก่อนเริ่มสรุป</h2>
      <p className="mx-auto mt-3 max-w-[26rem] leading-relaxed text-muted">
        ใช้บัญชี Google ได้เลย ไม่ต้องสมัครใหม่ ผลสรุปทุกไฟล์จะเก็บไว้ให้เปิดอ่านย้อนหลังได้
      </p>
      <form action={signInWithGoogle} className="mt-7">
        <GoogleButton />
      </form>
      <p className="mt-5 text-[13px] text-muted">เว็บเก็บเฉพาะผลสรุป ไม่เก็บไฟล์ PDF ของคุณ</p>
    </div>
  );
}
