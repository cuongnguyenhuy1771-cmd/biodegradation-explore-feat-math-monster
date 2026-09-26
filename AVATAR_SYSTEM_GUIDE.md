# Hướng dẫn: Cập nhật hệ thống Avatar

## Tổng quan thay đổi

Đã chuyển đổi từ lưu URL avatar sang lưu **Avatar ID** trong database, với avatar được load từ local assets.

## Cấu trúc mới

### 1. Avatar Assets
**Location:** `assets/images/avatar/`
- `img_1.png` → `avatar_1`
- `img_2.png` → `avatar_2`
- `img_3.png` → `avatar_3`
- `img_4.png` → `avatar_4`
- `img_5.png` → `avatar_5`
- `img_6.png` → `avatar_6`
- `img_7.png` → `avatar_7`
- `img_8.png` → `avatar_8`
- `img.png` → `avatar_default`

### 2. Avatar IDs trong Database
**Column:** `profiles.avatar_url` (giữ tên cũ để tương thích)
**Giá trị mới:** Lưu ID thay vì URL
- Trước: `"https://example.com/avatar.png"`
- Bây giờ: `"avatar_1"`, `"avatar_2"`, etc.

### 3. Files đã cập nhật

#### `src/constants/avatar-options.json`
```json
[
  { "id": "avatar_1", "label": "Avatar 1", "avatar_url": "avatar_1" },
  { "id": "avatar_2", "label": "Avatar 2", "avatar_url": "avatar_2" },
  ...
]
```

#### `src/utils/avatar.ts`
**Functions mới:**
- `getAvatarAsset(avatarId)` - Get local asset by ID
- `isLocalAvatarId(avatarId)` - Check if ID is valid
- `getAvatarSource(avatarId, fallbackName)` - Get source for Image component

**Function cũ (backward compatible):**
- `getAvatarUrl()` - Vẫn giữ để tương thích

#### `src/components/cyber/AvatarPicker.tsx`
- Load avatars từ local assets
- Truyền avatar ID khi onChange

#### Các màn hình đã cập nhật:
- `src/modules/auth/components/UserInfoForm.tsx` - Signup flow
- `src/app/(screens)/account-profile.tsx` - Profile edit
- `src/app/(tabs)/home.tsx` - Home tab
- `src/app/(tabs)/user.tsx` - User tab
- `src/app/(tabs)/story.tsx` - Leaderboard tab
- `src/components/cyber/TopPodium.tsx` - Top 3 display

## Cách sử dụng

### Hiển thị avatar:
```tsx
import { getAvatarSource } from '@/utils/avatar'

<Image
  source={getAvatarSource(profile.avatar_url, profile.username)}
  style={{ width: 50, height: 50, borderRadius: 25 }}
/>
```

### Lưu avatar:
```tsx
// User chọn avatar trong AvatarPicker
const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)

// selectedAvatar sẽ là "avatar_1", "avatar_2", etc.

// Lưu vào database
await supabase
  .from('profiles')
  .update({ avatar_url: selectedAvatar })
  .eq('id', userId)
```

## Migration cho dữ liệu cũ

Nếu database có dữ liệu cũ với URL, cần chạy migration:

```sql
-- Convert old URLs to new IDs
UPDATE profiles
SET avatar_url = 'avatar_default'
WHERE avatar_url IS NOT NULL 
  AND (avatar_url LIKE 'http%' OR avatar_url LIKE '/fake/%');

-- Set default avatar for null values
UPDATE profiles
SET avatar_url = 'avatar_default'
WHERE avatar_url IS NULL;
```

## Lợi ích

✅ **Performance tốt hơn** - Load local assets nhanh hơn URL  
✅ **Offline-ready** - Không cần internet để hiển thị avatar  
✅ **Tiết kiệm storage** - Không cần lưu trữ ảnh trên server  
✅ **Dễ quản lý** - Chỉ cần manage 9 ảnh trong assets  
✅ **Consistent UX** - Avatar luôn load ngay lập tức  

## Notes

- Vẫn hỗ trợ fallback về UI Avatars API nếu avatar ID không hợp lệ
- Backward compatible với code cũ sử dụng `getAvatarUrl()`
- Database column `avatar_url` giữ nguyên tên (không cần alter table)
