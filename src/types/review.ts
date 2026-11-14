// Row shape of public.reviews (see supabase/migrations).
export type Review = {
  id: string;
  listing_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

// A review plus its author's display name, for showing on the listing page.
// null = the author left their name blank at sign-up. undefined = names couldn't be loaded.
export type ReviewWithAuthor = Review & { reviewer_name?: string | null };
