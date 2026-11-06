begin;

-- Anyone (logged in or not) can read reviews, so the browse page can show average ratings
-- and sort by them. Writes stay restricted: with no insert/update/delete policies, only the
-- secret key can change data until review submission adds its own policies.
create policy "Reviews are publicly readable"
    on public.reviews
    for select
    to anon, authenticated
    using (true);

commit;
