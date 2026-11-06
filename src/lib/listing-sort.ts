import type { Listing, ListingSort, RatedListing } from "@/types/listing";

export const DEFAULT_SORT: ListingSort = "price";

export const SORT_OPTIONS: { value: ListingSort; label: string }[] = [
  { value: "price", label: "Price: low to high" },
  { value: "distance", label: "Distance: closest first" },
  { value: "rating", label: "Rating: highest first" },
];

// Reads the sort from a search param. Anything unrecognized falls back to the default.
export function parseListingSort(value: string | string[] | undefined): ListingSort {
  const raw = Array.isArray(value) ? value[0] : value;
  return SORT_OPTIONS.find((option) => option.value === raw)?.value ?? DEFAULT_SORT;
}

// Mean of the ratings, or null when there are none (no reviews is not the same as a 0).
export function averageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

// Ties fall through to price, then name, then id. Because that order is total, two listings
// keep the same relative order no matter which filters are applied.
function compareTiebreak(a: Listing, b: Listing): number {
  return a.price - b.price || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
}

// Returns a sorted copy. For "rating", unreviewed listings always go last.
export function sortListings(listings: RatedListing[], sort: ListingSort): RatedListing[] {
  const primary = (a: RatedListing, b: RatedListing): number => {
    if (sort === "distance") return a.distance_miles - b.distance_miles;
    if (sort === "rating") return (b.average_rating ?? -1) - (a.average_rating ?? -1);
    return 0;
  };
  return [...listings].sort((a, b) => primary(a, b) || compareTiebreak(a, b));
}
