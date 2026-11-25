// URL /api/auth/* ทั้งหมด (หน้า login, callback จาก Google, logout) ให้ Auth.js จัดการ
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
