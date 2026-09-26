-- Chạy file này trên Supabase SQL Editor nếu app báo "Chưa có nhân vật"
-- (thường do thiếu GRANT, không chỉ thiếu seed)

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on all tables in schema public to postgres, service_role;
grant all on all routines in schema public to postgres, service_role;
grant all on all sequences in schema public to postgres, service_role;

alter default privileges for role postgres in schema public
  grant all on tables to postgres, service_role;

alter default privileges for role postgres in schema public
  grant all on routines to postgres, service_role;

alter default privileges for role postgres in schema public
  grant all on sequences to postgres, service_role;

-- Catalog + user tables — authenticated đọc/ghi theo RLS
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

grant usage, select on all sequences in schema public to authenticated;
