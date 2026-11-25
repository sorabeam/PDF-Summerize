import { auth } from "@/auth";
import { deleteSummary, getSummary } from "@/lib/db";

// [id] ในชื่อโฟลเดอร์ = dynamic route → /api/history/abc-123 ได้ id = "abc-123"
// Next 16: params เป็น Promise ต้อง await ก่อนใช้ · RouteContext<"..."> = type ที่ Next สร้างให้ตาม path

// GET /api/history/[id] → เปิดผลสรุปเก่า 1 รายการ
export async function GET(_request: Request, ctx: RouteContext<"/api/history/[id]">) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "เข้าสู่ระบบก่อน" }, { status: 401 });
  }

  const { id } = await ctx.params;
  try {
    const entry = await getSummary(userId, id);
    // ไม่มี หรือเป็นของคนอื่น → ตอบเหมือนกันว่าไม่พบ (ไม่บอกว่ามีอยู่จริงไหม)
    if (!entry) {
      return Response.json({ error: "ไม่พบผลสรุปนี้" }, { status: 404 });
    }
    return Response.json(entry);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "เปิดผลสรุปไม่สำเร็จ" }, { status: 500 });
  }
}

// DELETE /api/history/[id] → ลบออกจากประวัติ
export async function DELETE(_request: Request, ctx: RouteContext<"/api/history/[id]">) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "เข้าสู่ระบบก่อน" }, { status: 401 });
  }

  const { id } = await ctx.params;
  try {
    const deleted = await deleteSummary(userId, id);
    if (!deleted) {
      return Response.json({ error: "ไม่พบผลสรุปนี้" }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "ลบไม่สำเร็จ" }, { status: 500 });
  }
}
