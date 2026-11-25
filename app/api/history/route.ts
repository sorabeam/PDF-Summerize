import { connection } from "next/server";
import { auth } from "@/auth";
import { listSummaries } from "@/lib/db";

// GET /api/history → รายการสรุปที่เคยทำของคนที่ login อยู่ (ใหม่สุดก่อน)
export async function GET() {
  await connection(); // ทำตอนมีคำขอจริงเท่านั้น (เหตุผลเดียวกับ page.tsx)
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "เข้าสู่ระบบก่อน" }, { status: 401 });
  }

  try {
    return Response.json(await listSummaries(userId));
  } catch (err) {
    console.error(err);
    return Response.json({ error: "โหลดประวัติไม่สำเร็จ" }, { status: 500 });
  }
}
