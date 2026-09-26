# Hướng dẫn chuẩn bị ngân hàng câu hỏi

Dành cho học sinh soạn câu hỏi toán cho game **Math Monsters**.

- Mỗi **khu vực** thường có **10 câu**.
- Nên trộn **4 dạng** bên dưới.
- Câu ngắn, rõ. Gợi ý (`hint`) tùy chọn — **không lộ đáp án**.

---

## 4 dạng câu hỏi

| Dạng | `type` | Cần chuẩn bị |
|------|--------|--------------|
| Trắc nghiệm | `multiple_choice` | Đề + 4 đáp án A/B/C/D |
| Đúng / Sai | `true_false` | Mệnh đề + Đúng hoặc Sai |
| Nhập số | `input` | Đề + một số làm đáp án |
| Ghép cặp | `matching` | 3 cặp trái ↔ phải |

---

## Cấu trúc 1 câu

Mỗi câu gồm:

| Trường | Bắt buộc | Ghi chú |
|--------|----------|---------|
| `type` | Có | Một trong 4 dạng trên |
| `difficulty` | Không | `1` (dễ) → `5` (khó) |
| `hint` | Không | Gợi ý khi sai |
| `content` | Có | **Đề + đáp án đúng** (xem bảng dưới) |

### `content` theo từng dạng

**Trắc nghiệm**
```json
{ "prompt": "12 + 7 = ?", "options": ["17","18","19","20"], "correct_index": 2 }
```
→ `correct_index`: A=`0`, B=`1`, C=`2`, D=`3`

**Đúng / Sai**
```json
{ "prompt": "5 + 3 = 9", "correct": false }
```
→ `true` = Đúng, `false` = Sai

**Nhập số**
```json
{ "prompt": "9 + 6 = ?", "correct_answer": "15" }
```
→ Đáp án luôn ghi trong ngoặc kép `"15"`

**Ghép cặp**
```json
{
  "prompt": "Ghép phép tính với kết quả",
  "pairs": [
    { "left": "3 + 4", "right": "7" },
    { "left": "2 + 10", "right": "12" },
    { "left": "15 - 5", "right": "10" }
  ]
}
```
→ Nên 3 cặp. Không trùng kết quả bên phải.

---

## Lưu ý nhanh

- Trắc nghiệm: đủ **4 đáp án**, ngắn gọn.
- Nhập số: chỉ dùng **số** (`15`, `-3`, `2.5`).
- Ghép cặp: game tự xáo cột — bạn chỉ cần liệt kê đúng cặp.
- Tự làm lại từng câu trước khi nộp.

---

## Response mẫu tổng — Khu vực 1 (10 câu)

Copy file này, sửa nội dung, giữ nguyên cấu trúc.

```json
{
  "area": "Khu vực 1",
  "world": "Rừng Mầm Xanh",
  "questions": [
    {
      "question_index": 0,
      "type": "multiple_choice",
      "difficulty": 1,
      "hint": "Cộng hàng đơn vị trước",
      "content": {
        "prompt": "12 + 7 = ?",
        "options": ["17", "18", "19", "20"],
        "correct_index": 2
      }
    },
    {
      "question_index": 1,
      "type": "multiple_choice",
      "difficulty": 1,
      "hint": "25 trừ 8",
      "content": {
        "prompt": "25 - 8 = ?",
        "options": ["15", "16", "17", "18"],
        "correct_index": 2
      }
    },
    {
      "question_index": 2,
      "type": "multiple_choice",
      "difficulty": 1,
      "hint": null,
      "content": {
        "prompt": "14 + 5 = ?",
        "options": ["18", "19", "20", "21"],
        "correct_index": 1
      }
    },
    {
      "question_index": 3,
      "type": "multiple_choice",
      "difficulty": 2,
      "hint": null,
      "content": {
        "prompt": "11 + 9 = ?",
        "options": ["18", "19", "20", "21"],
        "correct_index": 2
      }
    },
    {
      "question_index": 4,
      "type": "true_false",
      "difficulty": 1,
      "hint": "So sánh từng cặp số",
      "content": {
        "prompt": "0 < 8 < 45",
        "correct": true
      }
    },
    {
      "question_index": 5,
      "type": "true_false",
      "difficulty": 1,
      "hint": "5 + 3 = 8",
      "content": {
        "prompt": "5 + 3 = 9",
        "correct": false
      }
    },
    {
      "question_index": 6,
      "type": "input",
      "difficulty": 1,
      "hint": "9 cộng 6",
      "content": {
        "prompt": "9 + 6 = ?",
        "correct_answer": "15"
      }
    },
    {
      "question_index": 7,
      "type": "input",
      "difficulty": 1,
      "hint": null,
      "content": {
        "prompt": "20 - 7 = ?",
        "correct_answer": "13"
      }
    },
    {
      "question_index": 8,
      "type": "matching",
      "difficulty": 2,
      "hint": "Tính từng phép một",
      "content": {
        "prompt": "Ghép phép tính với kết quả",
        "pairs": [
          { "left": "3 + 4", "right": "7" },
          { "left": "2 + 10", "right": "12" },
          { "left": "15 - 5", "right": "10" }
        ]
      }
    },
    {
      "question_index": 9,
      "type": "input",
      "difficulty": 1,
      "hint": null,
      "content": {
        "prompt": "30 - 12 = ?",
        "correct_answer": "18"
      }
    }
  ]
}
```

### Phân bổ gợi ý trong mẫu trên

| STT | Dạng | Nội dung |
|-----|------|----------|
| 0–3 | Trắc nghiệm | Cộng / trừ |
| 4–5 | Đúng / Sai | 1 đúng, 1 sai |
| 6–7, 9 | Nhập số | Cộng / trừ |
| 8 | Ghép cặp | 3 cặp phép tính |

---

*Gửi file JSON hoặc bảng Excel cho giáo viên / team dự án để nhập vào game.*
