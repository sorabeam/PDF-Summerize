# PDF Summarizer

เว็บช่วยอ่านหนังสือสอบ: อัพโหลด PDF → ได้ **โน้ตทบทวนก่อนสอบ** (จุดที่น่าจะออกสอบ + คำศัพท์) และ **สไลด์อธิบาย** เนื้อหาแบบมือใหม่เข้าใจ ดาวน์โหลดเป็น `.pptx` ได้

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Claude API · pptxgenjs

## รันบนเครื่อง

```bash
npm install
cp .env.example .env.local   # แล้วใส่ ANTHROPIC_API_KEY
npm run dev                  # เปิด http://localhost:3000
```

แก้ `.env.local` แล้วต้องปิด `npm run dev` แล้วเปิดใหม่ทุกครั้ง

## ตั้งค่า Login + ประวัติ (ครั้งแรกครั้งเดียว)

ต้อง login ด้วย Google ก่อนถึงจะสรุปได้ และผลสรุปทุกไฟล์เก็บใน Neon Postgres (`USE_MOCK=1` ข้ามทั้งสองอย่างได้)

1. **ติดตั้งแพ็กเกจ** `npm install next-auth@beta @neondatabase/serverless` แล้ว commit `package.json` + `package-lock.json`
2. **Google OAuth** ที่ [Google Cloud Console](https://console.cloud.google.com/) → สร้างโปรเจกต์ → **APIs & Services → OAuth consent screen** (External, ใส่ชื่อแอป + อีเมล แล้วกด **Publish app** ไม่งั้นใช้ได้แค่บัญชีที่เพิ่มเป็น test user)
   → **Credentials → Create credentials → OAuth client ID** (Web application) ใส่ **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://pdf-summerize.vercel.app/api/auth/callback/google`

   ได้ Client ID / Client secret → ใส่เป็น `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
3. **AUTH_SECRET** รัน `npx auth secret` (เขียนลง `.env.local` ให้เอง) · บน Vercel ใส่ค่าที่สุ่มใหม่ก็ได้
4. **ฐานข้อมูล** Vercel → โปรเจกต์ → **Storage → Create Database → Neon** → Connect กับโปรเจกต์ (จะได้ `DATABASE_URL` อัตโนมัติ) · ก๊อปค่ามาใส่ `.env.local` ด้วย
5. **สร้างตาราง** เปิด Neon Console → **SQL Editor** → วางไฟล์ `db/schema.sql` แล้วกด Run
6. ใส่ `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` ใน Vercel → Settings → Environment Variables แล้ว Redeploy

ข้อจำกัด: Google login ใช้ได้เฉพาะ URL ที่ใส่ใน redirect URIs → ลิงก์ Preview ของแต่ละ PR จะ login ไม่ได้ (ทดสอบบนเครื่องแทน)
สรุปได้ไม่เกิน `DAILY_SUMMARY_LIMIT` (20) ไฟล์ต่อคนต่อ 24 ชม. แก้ได้ใน `lib/constants.ts`

## โครงสร้าง

| ไฟล์ | หน้าที่ |
|---|---|
| `app/component/home.tsx` | หน้าหลัก เก็บ state ทั้งหมด (ไฟล์, สถานะ, ผลสรุป) |
| `app/component/uploadBox.tsx` | การ์ดเลือก/ลากวางไฟล์ + ปุ่ม "สรุปเลย" |
| `app/component/loadingNotice.tsx` | หน้ารอสรุป (นาฬิกา + ปุ่มยกเลิก) |
| `app/component/summaryView.tsx` | หน้าผลสรุป + แท็บ |
| `app/component/bulletView.tsx` | โน้ตทบทวน (ไฮไลต์จุดออกสอบ) + คลังคำศัพท์ (โหมดทดสอบ) |
| `app/component/slideView.tsx` | สไลด์ทีละหน้า (ปุ่ม ← → ได้) |
| `app/component/exportButton.tsx` | ปุ่มดาวน์โหลด .pptx |
| `app/api/summarize/route.ts` | API: ตรวจไฟล์ → เรียก Claude |
| `app/api/summarize/summarizePdf.ts` | ส่ง PDF ให้ Claude (bullets + slides พร้อมกัน) — **server เท่านั้น** |
| `app/api/summarize/parseSummary.ts` | ตรวจ/ทำความสะอาด JSON ที่ Claude ตอบ |
| `lib/exportPptx.ts` | สร้างไฟล์ .pptx ในเบราว์เซอร์ |
| `lib/constants.ts` | ค่าตั้งต้น: ขนาดไฟล์สูงสุด, รุ่น Claude, max tokens, โควตาต่อวัน |
| `auth.ts` · `app/actions.ts` | ตั้งค่า login Google (Auth.js) · ปุ่มเข้า/ออกจากระบบ |
| `lib/db.ts` · `db/schema.sql` | อ่าน/เขียนประวัติใน Neon (server เท่านั้น) · คำสั่งสร้างตาราง |
| `app/api/history/` | API ประวัติ: รายการ / เปิด / ลบ |
| `app/component/historyList.tsx` · `loginCard.tsx` | รายการ "สรุปที่เคยทำ" · การ์ดเข้าสู่ระบบ |
| `types/summary.ts` | type `Lecture` / `Bullet` / `Slide` / `TechnicalTerm` |
| `app/globals.css` | สีธีม "สมุดโน้ต" + เส้นบรรทัดพื้นหลัง (แก้สีที่นี่ที่เดียว) |

## Deploy บน Vercel

1. เข้า [vercel.com](https://vercel.com) → ล็อกอินด้วย GitHub → **Add New… → Project** → เลือก repo `PDF-Summerize` → **Import**
2. ตรง **Environment Variables** ใส่ `ANTHROPIC_API_KEY` = key ของเรา (ไม่ต้องใส่ `USE_MOCK`)
3. กด **Deploy** รอ 1–2 นาที ได้ลิงก์ `https://....vercel.app`
4. ต่อจากนี้ merge เข้า `main` เมื่อไร Vercel deploy ให้อัตโนมัติ

ข้อจำกัดที่ควรรู้
- Vercel รับไฟล์ได้ไม่เกิน 4.5 MB ต่อ request → เว็บเราจำกัดไว้ที่ 4 MB (`MAX_FILE_SIZE_MB`)
- ฟังก์ชันรันได้นานสุด 300 วินาที (ตั้ง `maxDuration = 300` ไว้แล้วใน `route.ts`)
- ใครมีลิงก์ก็ใช้ได้ และ **ทุกครั้งที่กดสรุปเสียเงินจาก key ของเรา** → ตั้งวงเงินสูงสุดใน console.anthropic.com (Limits) ไว้ด้วย
