-- =============================================================================
-- MATH MONSTERS — Supabase schema (public + storage + RPC)
--
-- PROJECT MỚI:
--   1. Tạo project trống trên app.supabase.com
--   2. SQL Editor → dán & Run TOÀN BỘ file này
--   3. Chạy tiếp seed.sql
--   4. Điền URL + anon key vào .env (SETUP_NEW_PROJECT.md)
--
-- Auth: auth.users (email/password, Google OAuth, OTP, reset password).
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.home_tab as enum ('home', 'collection', 'leaderboard', 'profile');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.question_type as enum ('multiple_choice', 'true_false', 'input', 'matching');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.daily_task_type as enum (
    'complete_matches',
    'correct_answers',
    'collect_stars',
    'earn_coins'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.daily_task_status as enum ('in_progress', 'completed', 'claimed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_type as enum (
    'welcome',
    'system',
    'area_unlock',
    'monster_unlock',
    'daily_task',
    'practice_reminder',
    'achievement'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Drop legacy (MEMORY DETOX, fitness, biodegradation, …)
-- ---------------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;

do $drop_triggers$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'quiz_attempts') then
    execute 'drop trigger if exists trg_quiz_attempts_daily_stats on public.quiz_attempts';
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles') then
    execute 'drop trigger if exists trg_profiles_notification_settings on public.profiles';
  end if;
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'battle_sessions') then
    execute 'drop trigger if exists trg_battle_sessions_daily_tasks on public.battle_sessions';
  end if;
end $drop_triggers$;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.ensure_notification_settings_for_profile() cascade;
drop function if exists public.sync_user_daily_stats_on_quiz_attempt() cascade;
drop function if exists public.complete_battle(uuid, int, int, int, int) cascade;
drop function if exists public.claim_daily_task(uuid) cascade;
drop function if exists public.init_user_daily_tasks(uuid, date) cascade;

drop view if exists public.leaderboard cascade;

drop table if exists public.battle_answers cascade;
drop table if exists public.battle_sessions cascade;
drop table if exists public.user_daily_tasks cascade;
drop table if exists public.daily_tasks cascade;
drop table if exists public.user_monsters cascade;
drop table if exists public.user_area_progress cascade;
drop table if exists public.area_questions cascade;
drop table if exists public.questions cascade;
drop table if exists public.areas cascade;
drop table if exists public.worlds cascade;
drop table if exists public.monsters cascade;
drop table if exists public.heroes cascade;
drop table if exists public.favorite_workout_templates cascade;
drop table if exists public.user_achievements cascade;
drop table if exists public.workout_sessions cascade;
drop table if exists public.scheduled_workouts cascade;
drop table if exists public.goals cascade;
drop table if exists public.training_plans cascade;
drop table if exists public.workout_template_tasks cascade;
drop table if exists public.workout_templates cascade;
drop table if exists public.activity_types cascade;
drop table if exists public.saved_articles cascade;
drop table if exists public.articles cascade;
drop table if exists public.meal_logs cascade;
drop table if exists public.meals cascade;
drop table if exists public.meal_plans cascade;
drop table if exists public.exercise_logs cascade;
drop table if exists public.sleep_logs cascade;
drop table if exists public.water_logs cascade;
drop table if exists public.weight_logs cascade;
drop table if exists public.case_studies cascade;
drop table if exists public.enzyme_pollutant_relationships cascade;
drop table if exists public.microorganism_enzyme_relationships cascade;
drop table if exists public.enzymes cascade;
drop table if exists public.microorganisms cascade;
drop table if exists public.pollutants cascade;
drop table if exists public.quiz_attempts cascade;
drop table if exists public.user_progress cascade;
drop table if exists public.quizzes cascade;
drop table if exists public.lessons cascade;
drop table if exists public.categories cascade;
drop table if exists public.user_daily_stats cascade;
drop table if exists public.notification_settings cascade;
drop table if exists public.notifications cascade;
drop table if exists public.achievements cascade;
drop table if exists public.app_content cascade;
drop table if exists public.profiles cascade;

drop type if exists public.plan_status cascade;
drop type if exists public.scheduled_workout_status cascade;
drop type if exists public.workout_session_status cascade;
drop type if exists public.goal_metric cascade;
drop type if exists public.goal_timeframe cascade;
drop type if exists public.recurrence_kind cascade;
drop type if exists public.notification_category cascade;

-- ---------------------------------------------------------------------------
-- Profiles (hồ sơ người chơi)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  avatar_preset_id text,
  selected_hero_id uuid, -- FK thêm sau khi tạo bảng heroes
  level int not null default 1 check (level >= 1),
  total_points int not null default 0 check (total_points >= 0),
  total_coins int not null default 0 check (total_coins >= 0),
  total_stars int not null default 0 check (total_stars >= 0),
  dark_mode_enabled boolean not null default false,
  notifications_enabled boolean not null default true,
  preferred_language text not null default 'vi' check (preferred_language in ('vi', 'en')),
  default_home_tab public.home_tab not null default 'home',
  onboarding_completed_at timestamptz,
  hero_selected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index idx_profiles_username_unique on public.profiles (lower(username))
  where username is not null;
create index idx_profiles_leaderboard on public.profiles (total_points desc, created_at asc);

-- ---------------------------------------------------------------------------
-- Nhân vật chơi (Chọn nhân vật)
-- ---------------------------------------------------------------------------
create table public.heroes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_heroes_sort on public.heroes (sort_order, name);

alter table public.profiles
  add constraint profiles_selected_hero_id_fkey
  foreign key (selected_hero_id) references public.heroes (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Thế giới → Khu vực (Home + Level selection)
-- ---------------------------------------------------------------------------
create table public.worlds (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  background_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_worlds_sort on public.worlds (sort_order, name);

create table public.areas (
  id uuid primary key default gen_random_uuid(),
  world_id uuid not null references public.worlds (id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  order_index int not null default 1 check (order_index >= 1),
  total_questions int not null default 10 check (total_questions > 0),
  required_stars_to_unlock int not null default 0 check (required_stars_to_unlock >= 0),
  points_reward int not null default 100 check (points_reward >= 0),
  coins_reward int not null default 50 check (coins_reward >= 0),
  monster_id uuid, -- FK thêm sau khi tạo bảng monsters
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (world_id, slug),
  unique (world_id, order_index)
);

create index idx_areas_world_order on public.areas (world_id, order_index);

-- ---------------------------------------------------------------------------
-- Quái vật sưu tập (Bộ sưu tập)
-- ---------------------------------------------------------------------------
create table public.monsters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  unlock_area_id uuid references public.areas (id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_monsters_sort on public.monsters (sort_order, name);

alter table public.areas
  add constraint areas_monster_id_fkey
  foreign key (monster_id) references public.monsters (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Ngân hàng câu hỏi toán (4 loại: MCQ, Đ/S, nhập, ghép cặp)
-- content JSONB:
--   multiple_choice: { "prompt": "12 + 7 = ?", "options": ["17","18","19"], "correct_index": 2 }
--   true_false:      { "prompt": "0 < 8 < 45", "correct": true }
--   input:           { "prompt": "12 + 7 = ?", "correct_answer": "19" }
--   matching:        { "prompt": "Ghép cặp", "pairs": [{"left":"3+4","right":"7"}] }
-- ---------------------------------------------------------------------------
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  type public.question_type not null,
  difficulty int not null default 1 check (difficulty between 1 and 5),
  content jsonb not null default '{}'::jsonb,
  hint text,
  created_at timestamptz not null default now()
);

create index idx_questions_type on public.questions (type, difficulty);

create table public.area_questions (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  question_index int not null default 0 check (question_index >= 0),
  unique (area_id, question_id),
  unique (area_id, question_index)
);

create index idx_area_questions_area on public.area_questions (area_id, question_index);

-- ---------------------------------------------------------------------------
-- Tiến độ người chơi theo khu vực
-- ---------------------------------------------------------------------------
create table public.user_area_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  area_id uuid not null references public.areas (id) on delete cascade,
  stars_earned int not null default 0 check (stars_earned between 0 and 3),
  best_score int not null default 0 check (best_score >= 0),
  is_unlocked boolean not null default false,
  attempts_count int not null default 0 check (attempts_count >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, area_id)
);

create index idx_user_area_progress_user on public.user_area_progress (user_id, area_id);
create index idx_user_area_progress_unlocked on public.user_area_progress (user_id, is_unlocked);

-- ---------------------------------------------------------------------------
-- Lịch sử trận đấu (battle sessions)
-- ---------------------------------------------------------------------------
create table public.battle_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  area_id uuid not null references public.areas (id) on delete cascade,
  hero_id uuid references public.heroes (id) on delete set null,
  score int not null default 0 check (score >= 0),
  stars_earned int not null default 0 check (stars_earned between 0 and 3),
  correct_answers int not null default 0 check (correct_answers >= 0),
  total_questions int not null default 0 check (total_questions > 0),
  accuracy_pct numeric(5, 2) generated always as (
    case
      when total_questions > 0
      then round((correct_answers::numeric / total_questions::numeric) * 100, 2)
      else 0
    end
  ) stored,
  duration_seconds int check (duration_seconds is null or duration_seconds >= 0),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index idx_battle_sessions_user on public.battle_sessions (user_id, completed_at desc);
create index idx_battle_sessions_area on public.battle_sessions (user_id, area_id, completed_at desc);

create table public.battle_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.battle_sessions (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  is_correct boolean not null,
  answer_given jsonb,
  time_ms int check (time_ms is null or time_ms >= 0),
  created_at timestamptz not null default now()
);

create index idx_battle_answers_session on public.battle_answers (session_id);

-- ---------------------------------------------------------------------------
-- Bộ sưu tập quái vật của người chơi
-- ---------------------------------------------------------------------------
create table public.user_monsters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  monster_id uuid not null references public.monsters (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, monster_id)
);

create index idx_user_monsters_user on public.user_monsters (user_id, unlocked_at desc);

-- ---------------------------------------------------------------------------
-- Nhiệm vụ hàng ngày
-- ---------------------------------------------------------------------------
create table public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  task_type public.daily_task_type not null,
  goal_value int not null default 1 check (goal_value > 0),
  reward_coins int not null default 0 check (reward_coins >= 0),
  reward_points int not null default 0 check (reward_points >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_daily_tasks_sort on public.daily_tasks (sort_order);

create table public.user_daily_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  task_id uuid not null references public.daily_tasks (id) on delete cascade,
  task_date date not null default (timezone('utc', now()))::date,
  current_value int not null default 0 check (current_value >= 0),
  status public.daily_task_status not null default 'in_progress',
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, task_id, task_date)
);

create index idx_user_daily_tasks_user_date on public.user_daily_tasks (user_id, task_date desc);

-- ---------------------------------------------------------------------------
-- Thông báo in-app
-- ---------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null default 'system',
  title text not null,
  message text not null,
  icon text not null default '🔔',
  icon_bg text not null default '#E0F2FE',
  is_read boolean not null default false,
  related_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index idx_notifications_user_created on public.notifications (user_id, created_at desc);
create index idx_notifications_user_unread on public.notifications (user_id, created_at desc)
  where is_read = false;

create table public.notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  practice_reminder_enabled boolean not null default true,
  practice_reminder_time time not null default '08:00',
  daily_task_reminder_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Nội dung tĩnh (Về chúng tôi, Liên hệ, Điều khoản, Bảo mật)
-- ---------------------------------------------------------------------------
create table public.app_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $t$
declare r record;
begin
  for r in
    select unnest(array[
      'profiles',
      'areas',
      'user_area_progress',
      'user_daily_tasks',
      'notification_settings'
    ]) as tbl
  loop
    execute format('
      drop trigger if exists trg_%I_updated_at on public.%I;
      create trigger trg_%I_updated_at
      before update on public.%I
      for each row execute procedure public.set_updated_at();
    ', r.tbl, r.tbl, r.tbl, r.tbl);
  end loop;
end $t$;

-- ---------------------------------------------------------------------------
-- Auth: tạo profile khi đăng ký
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full text;
  v_user text;
  v_default_hero uuid;
begin
  v_full := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    null
  );
  v_user := coalesce(
    new.raw_user_meta_data->>'username',
    case when new.email is not null then split_part(new.email, '@', 1) else null end,
    'player'
  );

  select id into v_default_hero
  from public.heroes
  where is_default = true
  order by sort_order
  limit 1;

  insert into public.profiles (
    id,
    username,
    full_name,
    email,
    avatar_url,
    avatar_preset_id,
    selected_hero_id
  )
  values (
    new.id,
    v_user,
    v_full,
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    coalesce(new.raw_user_meta_data->>'avatar_preset_id', null),
    v_default_hero
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.ensure_notification_settings_for_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notification_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  -- Chỉ mở khóa khu vực 1 của thế giới đầu tiên (sort_order nhỏ nhất)
  insert into public.user_area_progress (user_id, area_id, is_unlocked)
  select new.id, a.id, true
  from public.areas a
  join public.worlds w on w.id = a.world_id
  where a.order_index = 1
    and w.is_active = true
    and w.sort_order = (
      select min(sort_order) from public.worlds where is_active = true
    )
  on conflict (user_id, area_id) do nothing;

  -- Khởi tạo nhiệm vụ hàng ngày
  perform public.init_user_daily_tasks(new.id, (timezone('utc', now()))::date);

  return new;
end;
$$;

create trigger trg_profiles_notification_settings
  after insert on public.profiles
  for each row
  execute procedure public.ensure_notification_settings_for_profile();

-- ---------------------------------------------------------------------------
-- Khởi tạo nhiệm vụ hàng ngày cho user
-- ---------------------------------------------------------------------------
create or replace function public.init_user_daily_tasks(
  p_user_id uuid,
  p_task_date date default (timezone('utc', now()))::date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_daily_tasks (user_id, task_id, task_date)
  select p_user_id, dt.id, p_task_date
  from public.daily_tasks dt
  where dt.is_active = true
  on conflict (user_id, task_id, task_date) do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: Hoàn thành trận đấu (cập nhật tiến độ, điểm, nhiệm vụ — chống gian lận)
-- ---------------------------------------------------------------------------
create or replace function public.complete_battle(
  p_area_id uuid,
  p_correct_answers int,
  p_total_questions int,
  p_duration_seconds int default null,
  p_score int default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_area record;
  v_stars int;
  v_session_id uuid;
  v_prev_stars int := 0;
  v_new_stars int;
  v_coins int;
  v_points int;
  v_monster_id uuid;
  v_task_date date := (timezone('utc', now()))::date;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_total_questions <= 0 or p_correct_answers < 0 or p_correct_answers > p_total_questions then
    raise exception 'Invalid battle result';
  end if;

  select * into v_area from public.areas where id = p_area_id;
  if not found then
    raise exception 'Area not found';
  end if;

  -- Kiểm tra khu vực đã mở khóa
  if not exists (
    select 1 from public.user_area_progress
    where user_id = v_user_id and area_id = p_area_id and is_unlocked = true
  ) then
    raise exception 'Area is locked';
  end if;

  -- Tính sao: 3★ = 100%, 2★ = ≥70%, 1★ = hoàn thành
  v_stars := case
    when p_correct_answers = p_total_questions then 3
    when (p_correct_answers::numeric / p_total_questions) >= 0.7 then 2
    else 1
  end;

  select stars_earned into v_prev_stars
  from public.user_area_progress
  where user_id = v_user_id and area_id = p_area_id;

  v_new_stars := greatest(coalesce(v_prev_stars, 0), v_stars);
  v_coins := v_area.coins_reward;
  v_points := coalesce(nullif(p_score, 0), v_area.points_reward);

  -- Ghi session
  insert into public.battle_sessions (
    user_id, area_id, hero_id, score, stars_earned,
    correct_answers, total_questions, duration_seconds
  )
  select
    v_user_id, p_area_id, p.selected_hero_id, v_points, v_stars,
    p_correct_answers, p_total_questions, p_duration_seconds
  from public.profiles p
  where p.id = v_user_id
  returning id into v_session_id;

  -- Cập nhật tiến độ khu vực
  insert into public.user_area_progress (
    user_id, area_id, stars_earned, best_score, is_unlocked,
    attempts_count, completed_at
  )
  values (
    v_user_id, p_area_id, v_stars, v_points, true, 1, now()
  )
  on conflict (user_id, area_id) do update set
    stars_earned = greatest(user_area_progress.stars_earned, excluded.stars_earned),
    best_score = greatest(user_area_progress.best_score, excluded.best_score),
    attempts_count = user_area_progress.attempts_count + 1,
    completed_at = coalesce(user_area_progress.completed_at, excluded.completed_at),
    updated_at = now();

  -- Mở khóa khu vực tiếp theo trong cùng thế giới
  insert into public.user_area_progress (user_id, area_id, is_unlocked)
  select v_user_id, next_a.id, true
  from public.areas curr_a
  join public.areas next_a
    on next_a.world_id = curr_a.world_id
    and next_a.order_index = curr_a.order_index + 1
  where curr_a.id = p_area_id
  on conflict (user_id, area_id) do update set
    is_unlocked = true,
    updated_at = now();

  -- Hoàn thành khu cuối → mở khóa khu vực 1 thế giới kế tiếp
  insert into public.user_area_progress (user_id, area_id, is_unlocked)
  select v_user_id, first_next.id, true
  from public.areas curr_a
  join public.worlds curr_w on curr_w.id = curr_a.world_id
  join public.worlds next_w
    on next_w.is_active = true
    and next_w.sort_order = (
      select min(w2.sort_order)
      from public.worlds w2
      where w2.is_active = true
        and w2.sort_order > curr_w.sort_order
    )
  join public.areas first_next
    on first_next.world_id = next_w.id
    and first_next.order_index = 1
  where curr_a.id = p_area_id
    and not exists (
      select 1
      from public.areas later_a
      where later_a.world_id = curr_a.world_id
        and later_a.order_index > curr_a.order_index
    )
  on conflict (user_id, area_id) do update set
    is_unlocked = true,
    updated_at = now();

  -- Cộng điểm & xu (chỉ khi đạt sao mới hơn hoặc lần đầu hoàn thành)
  if v_stars > coalesce(v_prev_stars, 0) or v_prev_stars is null then
    update public.profiles set
      total_points = total_points + v_points,
      total_coins = total_coins + v_coins,
      total_stars = total_stars + (v_new_stars - coalesce(v_prev_stars, 0)),
      level = greatest(1, 1 + (total_points + v_points) / 1000),
      updated_at = now()
    where id = v_user_id;
  end if;

  -- Mở khóa quái vật nếu khu vực có monster
  select monster_id into v_monster_id from public.areas where id = p_area_id;
  if v_monster_id is not null then
    insert into public.user_monsters (user_id, monster_id)
    values (v_user_id, v_monster_id)
    on conflict (user_id, monster_id) do nothing;
  end if;

  -- Cập nhật nhiệm vụ hàng ngày
  perform public.init_user_daily_tasks(v_user_id, v_task_date);

  update public.user_daily_tasks udt set
    current_value = udt.current_value + 1,
    status = case
      when udt.current_value + 1 >= dt.goal_value then 'completed'::public.daily_task_status
      else udt.status
    end,
    updated_at = now()
  from public.daily_tasks dt
  where udt.task_id = dt.id
    and udt.user_id = v_user_id
    and udt.task_date = v_task_date
    and dt.task_type = 'complete_matches'
    and udt.status = 'in_progress';

  update public.user_daily_tasks udt set
    current_value = udt.current_value + p_correct_answers,
    status = case
      when udt.current_value + p_correct_answers >= dt.goal_value then 'completed'::public.daily_task_status
      else udt.status
    end,
    updated_at = now()
  from public.daily_tasks dt
  where udt.task_id = dt.id
    and udt.user_id = v_user_id
    and udt.task_date = v_task_date
    and dt.task_type = 'correct_answers'
    and udt.status = 'in_progress';

  update public.user_daily_tasks udt set
    current_value = udt.current_value + (v_new_stars - coalesce(v_prev_stars, 0)),
    status = case
      when udt.current_value + (v_new_stars - coalesce(v_prev_stars, 0)) >= dt.goal_value
        then 'completed'::public.daily_task_status
      else udt.status
    end,
    updated_at = now()
  from public.daily_tasks dt
  where udt.task_id = dt.id
    and udt.user_id = v_user_id
    and udt.task_date = v_task_date
    and dt.task_type = 'collect_stars'
    and udt.status = 'in_progress'
    and (v_new_stars - coalesce(v_prev_stars, 0)) > 0;

  return jsonb_build_object(
    'session_id', v_session_id,
    'stars_earned', v_stars,
    'best_stars', v_new_stars,
    'points_earned', v_points,
    'coins_earned', v_coins,
    'monster_unlocked', v_monster_id is not null
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: Nhận thưởng nhiệm vụ hàng ngày
-- ---------------------------------------------------------------------------
create or replace function public.claim_daily_task(p_user_daily_task_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_task record;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select udt.*, dt.reward_coins, dt.reward_points, dt.title
  into v_task
  from public.user_daily_tasks udt
  join public.daily_tasks dt on dt.id = udt.task_id
  where udt.id = p_user_daily_task_id and udt.user_id = v_user_id;

  if not found then
    raise exception 'Task not found';
  end if;

  if v_task.status != 'completed' then
    raise exception 'Task not completed';
  end if;

  update public.user_daily_tasks set
    status = 'claimed',
    claimed_at = now(),
    updated_at = now()
  where id = p_user_daily_task_id;

  update public.profiles set
    total_coins = total_coins + v_task.reward_coins,
    total_points = total_points + v_task.reward_points,
    updated_at = now()
  where id = v_user_id;

  return jsonb_build_object(
    'coins', v_task.reward_coins,
    'points', v_task.reward_points,
    'title', v_task.title
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- View: bảng xếp hạng
-- ---------------------------------------------------------------------------
create or replace view public.leaderboard as
select
  id,
  username,
  full_name,
  avatar_url,
  level,
  total_points,
  total_stars,
  rank() over (order by total_points desc, created_at asc) as rank
from public.profiles
where username is not null;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.heroes enable row level security;
alter table public.worlds enable row level security;
alter table public.areas enable row level security;
alter table public.monsters enable row level security;
alter table public.questions enable row level security;
alter table public.area_questions enable row level security;
alter table public.user_area_progress enable row level security;
alter table public.battle_sessions enable row level security;
alter table public.battle_answers enable row level security;
alter table public.user_monsters enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.user_daily_tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_settings enable row level security;
alter table public.app_content enable row level security;

-- Profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_select_leaderboard"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Catalog (đọc khi đã đăng nhập)
create policy "heroes_select_authenticated"
  on public.heroes for select to authenticated using (true);

create policy "worlds_select_authenticated"
  on public.worlds for select to authenticated using (true);

create policy "areas_select_authenticated"
  on public.areas for select to authenticated using (true);

create policy "monsters_select_authenticated"
  on public.monsters for select to authenticated using (true);

create policy "questions_select_authenticated"
  on public.questions for select to authenticated using (true);

create policy "area_questions_select_authenticated"
  on public.area_questions for select to authenticated using (true);

create policy "daily_tasks_select_authenticated"
  on public.daily_tasks for select to authenticated using (true);

create policy "app_content_select_authenticated"
  on public.app_content for select to authenticated using (true);

-- User-owned data
create policy "user_area_progress_all_own"
  on public.user_area_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "battle_sessions_select_own"
  on public.battle_sessions for select
  using (auth.uid() = user_id);

create policy "battle_answers_select_own"
  on public.battle_answers for select
  using (
    exists (
      select 1 from public.battle_sessions bs
      where bs.id = session_id and bs.user_id = auth.uid()
    )
  );

create policy "user_monsters_select_own"
  on public.user_monsters for select
  using (auth.uid() = user_id);

create policy "user_daily_tasks_all_own"
  on public.user_daily_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications_select_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications_update_own"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "notifications_insert_own"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "notification_settings_all_own"
  on public.notification_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage: avatars + game assets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('game-assets', 'game-assets', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatars public read" on storage.objects;
drop policy if exists "Avatars upload own folder" on storage.objects;
drop policy if exists "Avatars update own folder" on storage.objects;
drop policy if exists "Avatars delete own folder" on storage.objects;
drop policy if exists "Game assets public read" on storage.objects;

create policy "Avatars public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Avatars upload own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatars update own folder"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatars delete own folder"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Game assets public read"
  on storage.objects for select
  using (bucket_id = 'game-assets');

-- ---------------------------------------------------------------------------
-- Grants (bắt buộc — thiếu sẽ lỗi permission denied khi đọc heroes/worlds...)
-- ---------------------------------------------------------------------------
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on all tables in schema public to postgres, service_role;
grant all on all routines in schema public to postgres, service_role;
grant all on all sequences in schema public to postgres, service_role;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant usage, select on all sequences in schema public to authenticated;
