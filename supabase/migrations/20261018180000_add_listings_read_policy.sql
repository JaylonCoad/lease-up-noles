begin;

-- Anyone (logged in or not) can read listings. Writes stay restricted:
-- with no insert/update/delete policies, only the secret key can change data.
create policy "Listings are publicly readable"
    on public.listings
    for select
    to anon, authenticated
    using (true);

commit;