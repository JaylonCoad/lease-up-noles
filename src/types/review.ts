// Row shape of public.reviews (see supabase/migrations).
export type Review = {
  id: string;
  listing_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};
