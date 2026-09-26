# Supabase — Math Monsters

Backend: auth, hồ sơ, nhân vật, thế giới/khu vực, câu hỏi toán, trận đấu, sưu tập quái vật, nhiệm vụ hàng ngày, leaderboard.

Chi tiết kiến trúc: **[ARCHITECTURE.md](./ARCHITECTURE.md)**

## File SQL

| File | Khi nào chạy |
|------|----------------|
| `schema.sql` | **Luôn chạy đầu tiên** (project mới hoặc reset DB) |
| `seed.sql` | Sau `schema.sql` — dữ liệu mẫu |

## Project Supabase mới (khuyên dùng)

Làm theo checklist đầy đủ: **[SETUP_NEW_PROJECT.md](./SETUP_NEW_PROJECT.md)**

Tóm tắt:

1. Tạo project trên [Supabase Dashboard](https://app.supabase.com)
2. Điền `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_ANON_KEY` vào `.env`
3. SQL Editor → `schema.sql` → `seed.sql`
4. Bật Auth (Email + Google nếu cần)

## Schema

```
auth.users → profiles (level, coins, points, stars)
              ├── selected_hero → heroes
              ├── user_area_progress → areas → worlds
              ├── battle_sessions → battle_answers
              ├── user_monsters → monsters
              ├── user_daily_tasks → daily_tasks
              └── notifications, notification_settings

questions ← area_questions → areas
view: leaderboard
RPC: complete_battle, claim_daily_task, init_user_daily_tasks
storage: avatars, game-assets
```

## RPC chính

```typescript
// Kết thúc trận đấu
await supabase.rpc('complete_battle', {
  p_area_id: '...',
  p_correct_answers: 8,
  p_total_questions: 10,
})

// Nhận thưởng nhiệm vụ hàng ngày
await supabase.rpc('claim_daily_task', {
  p_user_daily_task_id: '...',
})
```

## Lưu ý

- **Project mới**: phần `DROP TABLE` trong `schema.sql` không ảnh hưởng (chưa có bảng).
- **DB cũ (MEMORY DETOX / fitness)**: `schema.sql` sẽ **xóa** toàn bộ bảng cũ — chỉ dùng khi chấp nhận mất dữ liệu.
- `total_points` = điểm xếp hạng; `total_coins` = xu trong game.
- Câu hỏi có 4 loại: `multiple_choice`, `true_false`, `input`, `matching`.

## App

Client đọc Supabase từ `src/lib/supabase.ts` (biến `EXPO_PUBLIC_*` trong `.env`).
