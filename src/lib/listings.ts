import { createClient } from "@/lib/supabase/server";
import type { Listing, ListingFilters } from "@/types/listing";

import { MAX_BEDROOM_OPTION } from "./listing-filters";

// Fetches listings that match the filters, cheapest first.
// Throws on a database error so the route's error boundary can show it.
export async function getListings(filters: ListingFilters): Promise<Listing[]> {
  const supabase = await createClient();
  let query = supabase.from("listings").select("*");

  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.bedrooms !== undefined) {
    query =
      filters.bedrooms >= MAX_BEDROOM_OPTION
        ? query.gte("bedrooms", MAX_BEDROOM_OPTION)
        : query.eq("bedrooms", filters.bedrooms);
  }
  // Listings whose distance hasn't been computed yet (NULL) are excluded by this filter.
  if (filters.maxDistance !== undefined) query = query.lte("distance_miles", filters.maxDistance);

  const { data, error } = await query.order("price", { ascending: true });
  if (error) throw new Error(`Could not load listings: ${error.message}`);

  // numeric columns come back from PostgREST as strings in some setups; normalize to numbers.
  return (data ?? []).map((row) => ({ ...row, price: Number(row.price) }) as Listing);
}
