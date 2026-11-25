"use server";

// Server Actions = ฟังก์ชันที่รันบน server แต่เรียกจากปุ่มฝั่ง client ได้ (ผ่าน <form action={...}>)
import { signIn, signOut } from "@/auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
