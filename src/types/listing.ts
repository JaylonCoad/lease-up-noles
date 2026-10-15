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
  distance_miles: number | null;
  created_at: string;
};

// Filters for the browse page. Every field is optional; undefined means "no filter".
export type ListingFilters = {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  maxDistance?: number;
};
