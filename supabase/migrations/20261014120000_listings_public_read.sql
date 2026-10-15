begin;

-- Listings are public: guests and signed-in students can browse them (FR1).
-- Writes stay blocked for these roles; only the secret key (seed script, admin tools) can insert.
create policy "Listings are readable by everyone"
    on public.listings
    for select
    to anon, authenticated
    using (true);

commit;
