# Supabase — Math Monsters

> **Bạn tạo project Supabase mới?** Dùng **[supabase/SETUP_NEW_PROJECT.md](supabase/SETUP_NEW_PROJECT.md)** — không cần migrate từ DB cũ.

## Setup project mới (tóm tắt)

1. Tạo project trên Supabase Dashboard
2. Copy **Project URL** + **anon key** → `.env` (xem `.env.example`)
3. SQL Editor: chạy `supabase/schema.sql` rồi `supabase/seed.sql`
4. Authentication: bật Email (+ Confirm email nếu OTP); Google nếu cần
5. `yarn start -c` và test đăng ký → chọn hero → chơi khu vực 1

## Kiểm tra DB

```sql
select table_name from information_schema.tables
where table_schema = 'public' order by table_name;
```

Bảng kỳ vọng: `profiles`, `heroes`, `worlds`, `areas`, `questions`, `area_questions`, `monsters`, `user_area_progress`, `battle_sessions`, `user_monsters`, `daily_tasks`, `user_daily_tasks`, `notifications`, `notification_settings`, `app_content`.

## RPC chính

| RPC | Mục đích |
|-----|----------|
| `complete_battle` | Kết thúc trận — cập nhật sao, điểm, xu, mở khóa |
| `claim_daily_task` | Nhận thưởng nhiệm vụ hàng ngày |
| `init_user_daily_tasks` | Khởi tạo nhiệm vụ ngày |

Chi tiết kiến trúc: [supabase/ARCHITECTURE.md](supabase/ARCHITECTURE.md)
