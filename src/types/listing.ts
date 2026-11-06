// Row shape of public.listings (see supabase/migrations).
export type Listing = {
  id: string;
  name: string;
  price: number;
  bedrooms: number;
  address: string;
  amenities: string[];
  lat: number;
  lng: number;
  distance_miles: number;
  created_at: string;
};

// A listing plus its review summary. average_rating is null when it has no reviews.
export type RatedListing = Listing & {
  average_rating: number | null;
  review_count: number;
};

// Filters for the browse page. Every field is optional; undefined means "no filter".
export type ListingFilters = {
  minPrice?: number;
  maxPrice?: number;
  // Sorted, without duplicates. MAX_BEDROOM_OPTION stands for that many bedrooms or more.
  bedrooms?: number[];
  minDistance?: number;
  maxDistance?: number;
};

export type ListingSort = "price" | "distance" | "rating";
