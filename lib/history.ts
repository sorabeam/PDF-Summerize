import type { HistoryEntry, HistoryItem } from "@/types/summary";

// เรียก /api/history จากฝั่ง client · ไม่สำเร็จ → throw Error ที่ข้อความโชว์ผู้ใช้ได้

async function errorFrom(res: Response, fallback: string): Promise<Error> {
  const body: { error?: string } = await res.json().catch(() => ({}));
  return new Error(body.error ?? fallback);
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch("/api/history", { cache: "no-store" });
  if (!res.ok) throw await errorFrom(res, "โหลดประวัติไม่สำเร็จ");
  return res.json();
}

export async function fetchHistoryEntry(id: string): Promise<HistoryEntry> {
  const res = await fetch(`/api/history/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) throw await errorFrom(res, "เปิดผลสรุปไม่สำเร็จ");
  return res.json();
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const res = await fetch(`/api/history/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw await errorFrom(res, "ลบไม่สำเร็จ");
}
