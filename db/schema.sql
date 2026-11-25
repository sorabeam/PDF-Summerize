-- รันครั้งเดียวใน Neon Console → SQL Editor (หรือ psql) ก่อนใช้งานฟีเจอร์ประวัติ
-- รันซ้ำได้ ไม่พัง (มี if not exists)

create table if not exists summaries (
  id          uuid primary key default gen_random_uuid(),
  user_id     text        not null,             -- รหัสบัญชี Google (token.sub)
  file_name   text        not null,             -- ชื่อไฟล์ PDF ที่อัปโหลด
  title       text        not null,             -- ชื่อเรื่องที่ Claude ตั้ง (lecture.name)
  lecture     jsonb       not null,             -- ผลสรุปทั้งก้อน (โน้ต + สไลด์ + คำศัพท์)
  created_at  timestamptz not null default now()
);

-- ดึง "ประวัติของฉัน เรียงใหม่สุดก่อน" ได้เร็ว
create index if not exists summaries_user_created_idx
  on summaries (user_id, created_at desc);
