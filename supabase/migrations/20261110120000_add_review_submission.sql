begin;

-- One review per user per listing. The server action checks this too, but the database is the
-- final guard, so a duplicate can't slip in even through a race or a direct request.
alter table public.reviews
    add constraint reviews_one_per_user_per_listing unique (listing_id, user_id);

-- Comments are limited to 1,000 characters (matches MAX_COMMENT_LENGTH in
-- src/lib/review-validation.ts). Empty comments are already rejected by the initial schema.
alter table public.reviews
    add constraint reviews_comment_length check (char_length(comment) <= 1000);

-- Logged-in users can add a review, but only as themselves. There is deliberately no update or
-- delete policy yet (admin moderation comes later).
create policy "Users can add their own reviews"
    on public.reviews
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

commit;
