# Math Monsters

Ứng dụng di động (React Native / Expo) giúp trẻ em học toán qua trận đấu với quái vật. Người chơi chọn anh hùng, chinh phục từng thế giới/khu vực, thu thập quái vật và leo bảng xếp hạng. Backend **Supabase** (Auth, PostgreSQL, Storage, RPC).

---
## [LINK-DEMO](https://drive.google.com/file/d/10RCPs6oddWwvyXqt0c4fYbG5tQ0vu0eK/view?usp=sharing)
## Tính năng chính

### Xác thực & onboarding
- Splash → Onboarding → Đăng nhập / Đăng ký
- Quên mật khẩu (OTP + đặt lại mật khẩu)
- Chọn nhân vật (Thiên Định, Linh Chi, …)
- Thiết lập avatar sau đăng ký
### Ảnh minh họa layout

<table>
  <tr>
    <td><img src="https://drive.google.com/thumbnail?id=1SEOrqKOAPy32TL9pNkiQ_RWBdE-fsAmk&sz=w1000" width="220" alt="Screenshot 1"></td>
    <td><img src="https://drive.google.com/thumbnail?id=18u7pIAPH_JZgk8An-a22k2PGshmhlI04&sz=w1000" width="220" alt="Screenshot 2"></td>
    <td><img src="https://drive.google.com/thumbnail?id=19fkwtc3q_xEnltrbSAaLsdrwtDaYjML1&sz=w1000" width="220" alt="Screenshot 3"></td>
    <td><img src="https://drive.google.com/thumbnail?id=1GBISYo1Wdw1sTp1kkXtl1u7ut095CiX6&sz=w1000" width="220" alt="Screenshot 4"></td>
  </tr>
</table>

### Các nhân vật

<table>
  <tr>
    <td><img src="https://drive.google.com/thumbnail?id=1ZcfniSuUbFZz5AGKkJoXPHtqdIVaS9JT&sz=w1000" width="220" alt="Character 1"></td>
    <td><img src="https://drive.google.com/thumbnail?id=1EMMzURlj9wMao5z5w9qKgVwZW-QcEiDy&sz=w1000" width="220" alt="Character 2"></td>
    <td><img src="https://drive.google.com/thumbnail?id=11mN5rQQXhGvOwp1KpyudSJdmGICR68YG&sz=w1000" width="220" alt="Character 3"></td>
    <td><img src="https://drive.google.com/thumbnail?id=14OUHmQwL2jVKSYf2ZjnMGYQ-PPHCY4cT&sz=w1000" width="220" alt="Character 4"></td>
  </tr>
</table>

### Tab chính

| Tab | Route | Mô tả |
|-----|-------|--------|
| **Trang chủ** | `home` | Chọn thế giới, xem tiến độ khu vực, xu & level |
| **Bộ sưu tập** | `collection` | Quái vật đã mở khóa / chưa mở khóa |
| **Xếp hạng** | `leaderboard` | Top người chơi theo điểm, podium top 3 |
| **Cá nhân** | `profile` | Hồ sơ, cài đặt, thông báo, điều khoản |

### Luồng chơi game

```
Home → Danh sách khu vực → Chi tiết khu vực → Trận đấu → Kết quả (3 sao)
```

- **4 loại câu hỏi:** trắc nghiệm, đúng/sai, nhập đáp án, ghép cặp
- **Hệ thống sao:** 3★ = 100% đúng, 2★ ≥ 70%, 1★ = hoàn thành
- **Phần thưởng:** điểm, xu, mở khóa khu vực tiếp theo & quái vật
- **Nhiệm vụ hàng ngày:** hoàn thành trận, trả lời đúng, thu thập sao

### Gamification

| Chỉ số | Cột DB | Mô tả |
|--------|--------|--------|
| Level | `profiles.level` | Tự tăng theo điểm |
| Điểm | `profiles.total_points` | Xếp hạng |
| Xu | `profiles.total_coins` | Tiền trong game |
| Sao | `profiles.total_stars` | Tổng sao thu thập |

---

## Công nghệ

| Công nghệ | Ghi chú |
|-----------|---------|
| **Expo SDK 53** | Toolchain & native modules |
| **React Native 0.79** | UI đa nền tảng |
| **TypeScript** | Toàn bộ `src/` |
| **Expo Router v5** | File-based routing (`src/app/`) |
| **NativeWind v4** | Tailwind cho RN |
| **Supabase** | Auth, Postgres, RLS, RPC |
| **TanStack Query v5** | Server state / cache |

---

## Yêu cầu

- **Node.js** 20 LTS+
- **Yarn** hoặc **npm**
- Tài khoản **Supabase** (project + anon key)
- **iOS Simulator / Android Emulator / thiết bị thật**

---

## Cài đặt

### 1. Clone & cài dependency

```bash
git clone <repository-url> math-monsters
cd math-monsters
yarn install
```

### 2. Biến môi trường

Sao chép `.env.example` thành `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-or-publishable-key>
```

Khởi động lại Expo sau khi sửa `.env`: `yarn start -c`

### 3. Supabase — project mới

1. Tạo project trên [Supabase Dashboard](https://app.supabase.com)
2. Điền URL + anon key vào `.env`
3. SQL Editor: chạy `supabase/schema.sql` → `supabase/seed.sql`
4. Bật Auth (Email; Google tuỳ chọn)

Checklist đầy đủ: [supabase/SETUP_NEW_PROJECT.md](supabase/SETUP_NEW_PROJECT.md)

Kiến trúc DB: [supabase/ARCHITECTURE.md](supabase/ARCHITECTURE.md)

---

## Chạy ứng dụng

```bash
yarn start        # Dev server
yarn ios          # iOS
yarn android      # Android
yarn lint         # ESLint
```

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/          # onboard, sign-in, choose-hero, …
│   ├── (tabs)/          # home, collection, leaderboard, profile
│   └── (screens)/       # area-levels, battle, daily-tasks, account, …
├── components/
│   ├── common/          # Button, header, toast
│   ├── cyber/           # Leaderboard, podium, avatar picker
│   └── form/            # Input, OTP
├── services/
│   ├── mathMonsters.service.ts   # Game API (worlds, battle, collection)
│   ├── auth.service.ts
│   ├── profile.service.ts
│   └── notifications.service.ts
├── modules/auth/        # Form đăng nhập/đăng ký
├── hooks/               # useProfile, useNotificationCount
├── context/             # Auth, Query, Notifications
├── constants/           # Routes, images, avatars
└── types/               # database.types.ts (Supabase)

supabase/                # schema.sql, seed.sql, ARCHITECTURE.md
assets/                  # Ảnh, icon, logo
```

### Luồng màn hình

| Route | Màn hình |
|-------|-----------|
| `/` | Splash → redirect |
| `/onboard` | Giới thiệu app |
| `/choose-hero` | Chọn nhân vật |
| `/home` | Trang chủ — chọn thế giới |
| `/area-levels?worldId=` | Danh sách khu vực |
| `/area-detail?areaId=` | Popup trước trận |
| `/battle?areaId=` | Trận đấu toán |
| `/battle-result` | Kết quả 3 sao |
| `/daily-tasks` | Nhiệm vụ hàng ngày |
| `/notifications` | Thông báo in-app |

Định nghĩa route: `src/constants/route-table.ts`

---

## Service layer

Toàn bộ logic game gọi qua **`MathMonstersService`**:

```typescript
import { MathMonstersService } from '@/services/mathMonsters.service'

// Thế giới & khu vực
await MathMonstersService.getWorlds()
await MathMonstersService.getAreasWithProgress(worldId, userId)

// Trận đấu
const questions = await MathMonstersService.getBattleQuestions(areaId)
const result = await MathMonstersService.completeBattle(areaId, correct, total)

// Bộ sưu tập & xếp hạng
await MathMonstersService.getMonstersWithCollection(userId)
await MathMonstersService.getLeaderboard(50)

// Nhiệm vụ hàng ngày
await MathMonstersService.getDailyTasks(userId)
await MathMonstersService.claimDailyTask(taskId)
```

RPC server-side (`complete_battle`, `claim_daily_task`) chống gian lận — client không ghi trực tiếp vào bảng tiến độ.

---

## Bảng dữ liệu chính (Supabase)

| Bảng | Vai trò |
|------|---------|
| `profiles` | Level, điểm, xu, sao, hero đã chọn |
| `heroes` | Nhân vật chơi |
| `worlds` / `areas` | Thế giới & khu vực |
| `questions` / `area_questions` | Ngân hàng câu hỏi toán |
| `user_area_progress` | Tiến độ & sao theo khu vực |
| `battle_sessions` | Lịch sử trận đấu |
| `monsters` / `user_monsters` | Bộ sưu tập quái vật |
| `daily_tasks` / `user_daily_tasks` | Nhiệm vụ hàng ngày |
| `notifications` / `app_content` | Thông báo & nội dung tĩnh |

View: `leaderboard` · RPC: `complete_battle`, `claim_daily_task`

---

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `yarn start` | Khởi động Metro / Expo |
| `yarn ios` | Chạy trên iOS |
| `yarn android` | Chạy trên Android |
| `yarn lint` | ESLint |

---

## Ghi chú phát triển

- **React Query keys:** `worlds`, `world-progress`, `area-levels`, `battle-questions`, `collection`, `leaderboard`, `daily-tasks`, `profile`
- **Seed data:** `supabase/seed.sql` — heroes, worlds, areas, câu hỏi mẫu, daily tasks
- Repo có thể mang tên thư mục cũ (`biodegradation-explore`); sản phẩm hiện tại là **Math Monsters**

---

## License
Developer: Cuong Huy Nguyen
