begin;

-- FR4.2: every review shows the display name of the student who wrote it, even to Guests.
--
-- Profiles stay private (users can only read their own row, so roles aren't exposed). Instead,
-- this function hands out just the id and display name, and only for users who have written at
-- least one review, so it can't be used to list every account.
--
-- security definer lets it read profiles past RLS; the empty search_path stops anyone from
-- swapping in their own tables while it runs.
create function public.get_reviewer_names(user_ids uuid[])
returns table (id uuid, display_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.display_name
  from public.profiles p
  where p.id = any(user_ids)
    and exists (select 1 from public.reviews r where r.user_id = p.id);
$$;

-- Functions are executable by everyone by default; allow only the app's two roles.
revoke execute on function public.get_reviewer_names(uuid[]) from public;
grant execute on function public.get_reviewer_names(uuid[]) to anon, authenticated;

commit;
