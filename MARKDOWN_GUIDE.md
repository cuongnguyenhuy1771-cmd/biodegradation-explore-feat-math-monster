# Hướng dẫn: Markdown Support cho Lesson Content

## Tổng quan

Đã thêm hỗ trợ **Markdown rendering** cho nội dung bài học, giúp hiển thị đẹp hơn với:
- Headers (h1, h2, h3)
- Lists (bullet points, numbered lists)
- Bold/Italic text
- Code blocks
- Blockquotes

## Package đã cài đặt

```bash
npm install react-native-markdown-display
```

## Cập nhật code

### 1. Lesson Detail Screen
**File:** `src/app/(screens)/lesson-detail.tsx`

**Thay đổi:**
- Import `Markdown` component từ `react-native-markdown-display`
- Thêm `markdownStyles` object với custom styling
- Render content bằng `<Markdown>` thay vì `<Text>`

**Markdown styles:**
- Heading 1: 24px, bold, #1F2937
- Heading 2: 20px, bold, #1F2937
- Bullet points: Màu xanh (#2BB08F)
- Code blocks: Background #F3F4F6
- Strong/Bold: #1F2937, font-weight 700

### 2. Database Content Format

**Trước (Plain text):**
```
1. Mật khẩu mạnh là gì?
Mật khẩu mạnh là...

Một mật khẩu mạnh thường:
• Có ít nhất 8-12 ký tự
• Bao gồm chữ hoa...
```

**Bây giờ (Markdown):**
```markdown
# 1. Mật khẩu mạnh là gì?

Mật khẩu mạnh là...

**Một mật khẩu mạnh thường:**
- Có ít nhất 8-12 ký tự
- Bao gồm chữ hoa...
```

## Migration để convert nội dung

**File:** `supabase/migrations/20260322_convert_content_to_markdown.sql`

Chạy migration này để convert nội dung hiện tại sang format markdown:

```sql
UPDATE public.lessons 
SET content = '# 1. Mật khẩu mạnh là gì?

...'
WHERE id = '...';
```

### Cách chạy migration:

#### Option 1: Supabase Dashboard
1. Vào SQL Editor
2. Copy toàn bộ content từ migration file
3. Click Run

#### Option 2: Supabase CLI
```bash
supabase db push
```

## Markdown Syntax hỗ trợ

### Headers
```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Text formatting
```markdown
**Bold text**
*Italic text*
`Inline code`
```

### Code blocks
```markdown
```
Code block here
```
```

### Blockquotes
```markdown
> This is a quote
```

## Ví dụ content hoàn chỉnh

```markdown
# 1. Mật khẩu mạnh là gì?

Mật khẩu mạnh là mật khẩu khó đoán, khó bị bẻ khóa và đủ dài.

**Một mật khẩu mạnh thường:**
- Có ít nhất 8-12 ký tự
- Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
- Không chứa thông tin cá nhân dễ đoán

# 2. Ví dụ mật khẩu yếu cần tránh

- `123456`
- `password`
- `abc123`

# 3. Quy tắc quan trọng

- **Không dùng chung** một mật khẩu cho nhiều tài khoản
- **Đổi mật khẩu** định kỳ nếu nghi ngờ bị lộ
```

## Styling Colors

- **Primary text:** #374151 (gray-700)
- **Headings:** #1F2937 (gray-800)
- **Accent:** #2BB08F (green)
- **Code background:** #F3F4F6 (gray-100)
- **Blockquote background:** #F0F9FF (blue-50)

## Lợi ích

✅ **UX tốt hơn** - Nội dung dễ đọc với hierarchy rõ ràng  
✅ **Highlighting** - Bold, code blocks giúp nhấn mạnh thông tin quan trọng  
✅ **Professional** - Trông chuyên nghiệp hơn so với plain text  
✅ **Flexible** - Dễ dàng thêm formatting mới khi cần  
✅ **Consistent** - Styling đồng nhất trên toàn app  

## Notes

- Package `react-native-markdown-display` đã được cài đặt
- Không cần restart Metro bundler
- Styles có thể customize trong `markdownStyles` object
- Migration chỉ cần chạy 1 lần để convert dữ liệu cũ
