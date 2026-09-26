-- =============================================================================
-- MATH MONSTERS — Seed dữ liệu mẫu (chạy sau schema.sql)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Nhân vật chơi (Chọn nhân vật)
-- ---------------------------------------------------------------------------
insert into public.heroes (slug, name, description, sort_order, is_default) values
  ('thien-dinh', 'Thiên Định', 'Anh hùng mạnh mẽ với sức mạnh toán học vượt trội.', 1, true),
  ('linh-chi', 'Linh Chi', 'Nữ chiến binh thông minh, giải toán nhanh như chớp.', 2, false),
  ('bao-an', 'Bảo An', 'Cậu bé tò mò, luôn khám phá thế giới số.', 3, false),
  ('minh-quang', 'Minh Quang', 'Chiến binh trẻ đầy nhiệt huyết.', 4, false)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_default = excluded.is_default;

-- ---------------------------------------------------------------------------
-- Thế giới (6 thử thách — khớp Game Slider Figma + island-1..6)
-- ---------------------------------------------------------------------------
insert into public.worlds (slug, name, description, sort_order) values
  ('rung-mam-xanh', 'Rừng Mầm Xanh', 'Thế giới đầu tiên — phép cộng trừ trên đảo mầm xanh.', 1),
  ('sa-mac-keo-cat', 'Sa Mạc Kẹo Cát', 'Sa mạc kẹo cát — phép nhân và chia đầu tiên.', 2),
  ('hang-bang-lung-linh', 'Hang Băng Lung Linh', 'Hang băng lấp lánh — so sánh và sắp xếp số.', 3),
  ('hem-nui-banh-rang', 'Hẻm Núi Bánh Răng', 'Hẻm núi bánh răng — biểu thức và logic.', 4),
  ('nui-lua-keo-nong', 'Núi Lửa Kẹo Nóng', 'Núi lửa kẹo nóng — phân số và thập phân.', 5),
  ('tram-sao-cau-vong', 'Trạm Sao Cầu Vồng', 'Trạm sao cầu vồng — tổng hợp mọi kỹ năng.', 6)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true;

-- Vô hiệu hóa slug cũ (seed trước refactor)
update public.worlds
set is_active = false
where slug in ('dao-so-hoc', 'hang-dai-so');

-- ---------------------------------------------------------------------------
-- Quái vật sưu tập (1 quái / thế giới — khớp monsters/monster-1..6)
-- ---------------------------------------------------------------------------
insert into public.monsters (slug, name, description, sort_order) values
  ('mam-xanh', 'Mầm Xanh', 'Quái vật cây nhỏ dễ thương từ Rừng Mầm Xanh.', 1),
  ('keo-cat', 'Kẹo Cát', 'Sinh vật sa mạc làm từ kẹo cát ngọt ngào.', 2),
  ('bang-tinh', 'Băng Tinh', 'Tinh thể băng lấp lánh trong hang băng.', 3),
  ('banh-rang', 'Bánh Răng', 'Cư dân cơ khí của hẻm núi bánh răng.', 4),
  ('keo-nong', 'Kẹo Nóng', 'Quái vật dung nham kẹo từ núi lửa.', 5),
  ('sao-cau-vong', 'Sao Cầu Vồng', 'Sinh vật vũ trụ từ trạm sao cầu vồng.', 6)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- Quái seed cũ trùng sort_order — đẩy ra khỏi dãy 1..6 để tránh JOIN nhân đôi
update public.monsters
set sort_order = sort_order + 100
where slug in ('slime-xanh', 'la-vang', 'da-so-bay', 'rong-phuong-trinh');

-- ---------------------------------------------------------------------------
-- Khu vực — 12 khu vực / thế giới (UI: Khu vực 12/12)
-- ---------------------------------------------------------------------------
insert into public.areas (world_id, slug, name, order_index, total_questions, points_reward, coins_reward, monster_id)
select
  w.id,
  'khu-vuc-' || gs.n,
  'Khu vực ' || gs.n,
  gs.n,
  10,
  least(100 + (gs.n - 1) * 20, 340),
  least(50 + (gs.n - 1) * 10, 170),
  case
    when w.slug = 'rung-mam-xanh' and gs.n = 1 then m.id
    when w.slug <> 'rung-mam-xanh' and gs.n = 12 then m.id
    else null
  end
from public.worlds w
cross join generate_series(1, 12) as gs(n)
left join public.monsters m on m.slug = (
  case w.slug
    when 'rung-mam-xanh' then 'mam-xanh'
    when 'sa-mac-keo-cat' then 'keo-cat'
    when 'hang-bang-lung-linh' then 'bang-tinh'
    when 'hem-nui-banh-rang' then 'banh-rang'
    when 'nui-lua-keo-nong' then 'keo-nong'
    when 'tram-sao-cau-vong' then 'sao-cau-vong'
  end
)
where w.is_active = true
  and w.slug in (
    'rung-mam-xanh',
    'sa-mac-keo-cat',
    'hang-bang-lung-linh',
    'hem-nui-banh-rang',
    'nui-lua-keo-nong',
    'tram-sao-cau-vong'
  )
on conflict (world_id, slug) do update set
  name = excluded.name,
  order_index = excluded.order_index,
  total_questions = excluded.total_questions,
  points_reward = excluded.points_reward,
  coins_reward = excluded.coins_reward,
  monster_id = excluded.monster_id;

-- Gán khu vực mở khóa quái vật
update public.monsters m
set unlock_area_id = a.id
from public.areas a
join public.worlds w on w.id = a.world_id
where w.is_active = true
  and m.slug = (
    case w.slug
      when 'rung-mam-xanh' then 'mam-xanh'
      when 'sa-mac-keo-cat' then 'keo-cat'
      when 'hang-bang-lung-linh' then 'bang-tinh'
      when 'hem-nui-banh-rang' then 'banh-rang'
      when 'nui-lua-keo-nong' then 'keo-nong'
      when 'tram-sao-cau-vong' then 'sao-cau-vong'
    end
  )
  and (
    (w.slug = 'rung-mam-xanh' and a.slug = 'khu-vuc-1')
    or (w.slug <> 'rung-mam-xanh' and a.slug = 'khu-vuc-12')
  );

-- ---------------------------------------------------------------------------
-- Sửa tiến độ cũ: khóa lại thế giới 2+ nếu chưa hoàn thành thế giới trước
-- (trigger cũ từng mở nhầm khu vực 1 của mọi thế giới lúc đăng ký)
-- ---------------------------------------------------------------------------
update public.user_area_progress uap
set is_unlocked = false, updated_at = now()
from public.areas a
join public.worlds w on w.id = a.world_id
where uap.area_id = a.id
  and w.is_active = true
  and w.sort_order > (
    select min(sort_order) from public.worlds where is_active = true
  )
  and not exists (
    select 1
    from public.worlds prev_w
    join public.areas prev_last on prev_last.world_id = prev_w.id
    join public.user_area_progress prev_done
      on prev_done.area_id = prev_last.id
      and prev_done.user_id = uap.user_id
    where prev_w.is_active = true
      and prev_w.sort_order = w.sort_order - 1
      and prev_last.order_index = (
        select max(a2.order_index) from public.areas a2 where a2.world_id = prev_w.id
      )
      and prev_done.completed_at is not null
  );

-- Đảm bảo khu vực 1 thế giới đầu luôn mở cho mọi user hiện có
insert into public.user_area_progress (user_id, area_id, is_unlocked)
select p.id, a.id, true
from public.profiles p
cross join public.areas a
join public.worlds w on w.id = a.world_id
where a.order_index = 1
  and w.is_active = true
  and w.sort_order = (
    select min(sort_order) from public.worlds where is_active = true
  )
on conflict (user_id, area_id) do update set
  is_unlocked = true,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Câu hỏi mẫu — Khu vực 1 (phép cộng/trừ)
-- ---------------------------------------------------------------------------
insert into public.questions (type, difficulty, content, hint)
select v.type::public.question_type, v.difficulty, v.content::jsonb, v.hint
from (
  values
    (
      'multiple_choice', 1,
      '{"prompt": "12 + 7 = ?", "options": ["17", "18", "19", "20"], "correct_index": 2}',
      'Cộng hàng đơn vị trước'
    ),
    (
      'multiple_choice', 1,
      '{"prompt": "25 - 8 = ?", "options": ["15", "16", "17", "18"], "correct_index": 2}',
      '25 trừ 8'
    ),
    (
      'true_false', 1,
      '{"prompt": "0 < 8 < 45", "correct": true}',
      'So sánh từng cặp số'
    ),
    (
      'input', 1,
      '{"prompt": "9 + 6 = ?", "correct_answer": "15"}',
      '9 cộng 6'
    ),
    (
      'matching', 2,
      '{"prompt": "Ghép phép tính với kết quả", "pairs": [{"left": "3 + 4", "right": "7"}, {"left": "2 + 10", "right": "12"}, {"left": "15 - 5", "right": "10"}]}',
      'Tính từng phép một'
    ),
    (
      'multiple_choice', 1,
      '{"prompt": "14 + 5 = ?", "options": ["18", "19", "20", "21"], "correct_index": 1}',
      null
    ),
    (
      'true_false', 1,
      '{"prompt": "5 + 3 = 9", "correct": false}',
      '5 + 3 = 8'
    ),
    (
      'input', 1,
      '{"prompt": "20 - 7 = ?", "correct_answer": "13"}',
      null
    ),
    (
      'multiple_choice', 2,
      '{"prompt": "11 + 9 = ?", "options": ["18", "19", "20", "21"], "correct_index": 2}',
      null
    ),
    (
      'multiple_choice', 1,
      '{"prompt": "30 - 12 = ?", "options": ["16", "17", "18", "19"], "correct_index": 2}',
      null
    )
) as v(type, difficulty, content, hint)
where not exists (
  select 1 from public.questions q
  where q.content->>'prompt' = (v.content::jsonb)->>'prompt'
);

-- Gán câu hỏi vào Khu vực 1
insert into public.area_questions (area_id, question_id, question_index)
select a.id, q.id, row_number() over (order by q.created_at) - 1
from public.areas a
join public.worlds w on w.id = a.world_id
cross join (
  select id, created_at from public.questions
  order by created_at
  limit 10
) q
where w.slug = 'rung-mam-xanh' and a.slug = 'khu-vuc-1'
on conflict (area_id, question_id) do nothing;

-- ---------------------------------------------------------------------------
-- Nhiệm vụ hàng ngày
-- ---------------------------------------------------------------------------
insert into public.daily_tasks (slug, title, description, task_type, goal_value, reward_coins, reward_points, sort_order) values
  (
    'complete-3-matches',
    'Hoàn thành 3 trận',
    'Chơi và hoàn thành 3 trận đấu trong ngày.',
    'complete_matches',
    3,
    100,
    50,
    1
  ),
  (
    'correct-10-answers',
    'Trả lời đúng 10 câu',
    'Trả lời đúng 10 câu hỏi toán trong ngày.',
    'correct_answers',
    10,
    80,
    40,
    2
  ),
  (
    'collect-5-stars',
    'Thu thập 5 sao',
    'Kiếm thêm 5 sao từ các trận đấu.',
    'collect_stars',
    5,
    120,
    60,
    3
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  task_type = excluded.task_type,
  goal_value = excluded.goal_value,
  reward_coins = excluded.reward_coins,
  reward_points = excluded.reward_points,
  sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Nội dung pháp lý / hỗ trợ
-- ---------------------------------------------------------------------------
insert into public.app_content (slug, title, content) values
  (
    'about',
    'Về chúng tôi',
    'Math Monsters là trò chơi giáo dục toán học dành cho trẻ em. Con bạn sẽ chiến đấu cùng anh hùng, giải các câu đố toán học và thu thập quái vật dễ thương trên hành trình khám phá thế giới số.'
  ),
  (
    'terms',
    'Điều khoản & Điều kiện',
    'Nội dung điều khoản sử dụng. Vui lòng cập nhật bản chính thức trước khi phát hành app.'
  ),
  (
    'privacy',
    'Chính sách bảo mật',
    'Chúng tôi chỉ thu thập dữ liệu cần thiết cho tài khoản và tiến độ chơi game. Vui lòng cập nhật bản chính thức trước khi phát hành app.'
  ),
  (
    'contact',
    'Liên hệ',
    'Email: support@mathmonsters.app\nĐiện thoại: 1900-xxxx\nĐịa chỉ: Việt Nam'
  )
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  updated_at = now();
