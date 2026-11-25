"use client";

import { useEffect, useState } from "react";
import { deleteHistoryEntry, fetchHistory } from "@/lib/history";
import type { HistoryItem } from "@/types/summary";
import { ChevronIcon, Spinner, TrashIcon } from "./icons";
import { BUTTON_SECONDARY, FOCUS, SECTION_RULE } from "./styles";

const SHOW_FIRST = 6;

// "25 พ.ย. 2569 · 22:40" (ปฏิทินไทย เวลาตามเครื่องผู้ใช้)
function formatDate(iso: string): string {
  const date = new Date(iso);
  const day = date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
}

type HistoryListProps = {
  refreshKey: number; // เปลี่ยนเลขนี้ = โหลดรายการใหม่ (เช่น หลังสรุปไฟล์ใหม่เสร็จ)
  openingId: string | null;
  onOpen: (id: string) => void;
};

// รายการ "สรุปที่เคยทำ" ใต้การ์ดอัปโหลด
export function HistoryList({ refreshKey, openingId, onOpen }: HistoryListProps) {
  const [items, setItems] = useState<HistoryItem[] | null>(null); // null = กำลังโหลด
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // ignore = กันกรณีโหลดช้าแล้ว component หายไปก่อน/โหลดซ้อนกัน → ไม่เอาผลเก่ามาทับ
    let ignore = false;
    fetchHistory()
      .then((list) => {
        if (!ignore) {
          setItems(list);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (!ignore) setError(err instanceof Error ? err.message : "โหลดประวัติไม่สำเร็จ");
      });
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteHistoryEntry(id);
      setItems((list) => list?.filter((item) => item.id !== id) ?? null);
      setConfirmId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  }

  const visible = items && !showAll ? items.slice(0, SHOW_FIRST) : items;

  return (
    <section id="history" className={`${SECTION_RULE} scroll-mt-6`}>
      <div className="flex items-baseline gap-3">
        <h2 className="font-serif text-[22px] font-bold sm:text-[26px]">สรุปที่เคยทำ</h2>
        {items && items.length > 0 && (
          <span className="text-[15px] text-muted tabular-nums">{items.length} ไฟล์</span>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      {items === null && !error && (
        <p className="mt-4 flex items-center gap-2 text-muted">
          <Spinner className="size-4" /> กำลังโหลดประวัติ...
        </p>
      )}

      {items && items.length === 0 && (
        <p className="mt-3 text-muted">ยังไม่มีประวัติ อัปโหลดไฟล์แรกด้านบนได้เลย ผลสรุปจะมาเก็บไว้ตรงนี้</p>
      )}

      {visible && visible.length > 0 && (
        <ul className="mt-4 grid gap-x-6 md:grid-cols-2">
          {visible.map((item) => {
            const confirming = confirmId === item.id;
            const opening = openingId === item.id;
            return (
              <li key={item.id} className="flex items-center gap-2 border-b border-rule py-1.5">
                <button
                  type="button"
                  onClick={() => onOpen(item.id)}
                  disabled={openingId !== null}
                  className={`group flex min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-pen-soft/60 disabled:cursor-wait ${FOCUS}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{item.title}</span>
                    <span className="mt-0.5 block truncate text-sm text-muted">
                      {item.fileName} · {formatDate(item.createdAt)}
                    </span>
                  </span>
                  {opening ? (
                    <Spinner className="size-5 shrink-0 text-pen" />
                  ) : (
                    <ChevronIcon direction="right" className="size-5 shrink-0 text-muted group-hover:text-ink" />
                  )}
                </button>

                {confirming ? (
                  <span className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className={`rounded-md bg-danger px-2.5 py-1.5 text-sm font-semibold text-white disabled:opacity-50 ${FOCUS}`}
                    >
                      {deletingId === item.id ? "กำลังลบ..." : "ลบ"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className={`rounded-md px-2 py-1.5 text-sm text-muted hover:text-ink ${FOCUS}`}
                    >
                      ไม่ลบ
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(item.id)}
                    aria-label={`ลบ ${item.title} ออกจากประวัติ`}
                    className={`grid size-9 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-danger-soft hover:text-danger ${FOCUS}`}
                  >
                    <TrashIcon className="size-[18px]" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {items && items.length > SHOW_FIRST && (
        <button type="button" onClick={() => setShowAll(!showAll)} className={`${BUTTON_SECONDARY} mt-5 text-[15px]`}>
          {showAll ? "ย่อรายการ" : `ดูทั้งหมด ${items.length} ไฟล์`}
        </button>
      )}
    </section>
  );
}
