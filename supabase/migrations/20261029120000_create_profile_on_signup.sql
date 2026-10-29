begin;

-- When someone signs up, Supabase Auth inserts a row into auth.users.
-- This trigger gives every new user a matching public.profiles row,
-- so the app always has a role to check (default: 'student').
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Give a profile to anyone who signed up before this trigger existed.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- Logged-in users can read their own profile (needed to check their role).
-- There is deliberately no update policy, so users cannot promote themselves to admin.
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

commit;
