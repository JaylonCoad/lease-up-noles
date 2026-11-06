import { createClient } from "@/lib/supabase/server";
import type { Listing, ListingFilters, ListingSort, RatedListing } from "@/types/listing";

import { bedroomsExpression } from "./listing-filters";
import { averageRating, sortListings } from "./listing-sort";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// Loads each listing's ratings. Ratings are an extra, so if they can't be read the listings
// still show (as unreviewed) rather than the whole browse page failing.
async function getRatingsByListing(
  supabase: SupabaseClient,
  listingIds: string[],
): Promise<Map<string, number[]>> {
  const ratings = new Map<string, number[]>();
  if (listingIds.length === 0) return ratings;

  const { data, error } = await supabase
    .from("reviews")
    .select("listing_id, rating")
    .in("listing_id", listingIds);
  if (error) {
    console.error(`Could not load review ratings: ${error.message}`);
    return ratings;
  }

  for (const { listing_id, rating } of data ?? []) {
    ratings.set(listing_id, [...(ratings.get(listing_id) ?? []), rating]);
  }
  return ratings;
}

// Fetches listings that match the filters, with their ratings, in the requested order.
// Sorting happens here rather than in SQL because the average rating isn't a column.
// Throws on a database error so the route's error boundary can show it.
export async function getListings(
  filters: ListingFilters,
  sort: ListingSort,
): Promise<RatedListing[]> {
  const supabase = await createClient();
  let query = supabase.from("listings").select("*");

  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.bedrooms !== undefined) query = query.or(bedroomsExpression(filters.bedrooms));
  if (filters.minDistance !== undefined) {
    query = query.gte("distance_miles", filters.minDistance);
  }
  if (filters.maxDistance !== undefined) {
    query = query.lte("distance_miles", filters.maxDistance);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Could not load listings: ${error.message}`);

  const rows = data ?? [];
  const ratings = await getRatingsByListing(
    supabase,
    rows.map((row) => row.id),
  );

  const listings = rows.map((row) => {
    const listingRatings = ratings.get(row.id) ?? [];
    return {
      // numeric columns come back from PostgREST as strings in some setups; normalize to numbers.
      ...(row as Listing),
      price: Number(row.price),
      distance_miles: Number(row.distance_miles),
      average_rating: averageRating(listingRatings),
      review_count: listingRatings.length,
    };
  });

  return sortListings(listings, sort);
}
