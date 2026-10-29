import type { ListingFilters } from "@/types/listing";

// The bedroom filter's top option. Choosing it matches this many bedrooms or more ("4+").
export const MAX_BEDROOM_OPTION = 4;

type SearchParams = { [key: string]: string | string[] | undefined };

// Reads a non-negative number from a search param. Blank, malformed, or negative values
// are ignored, so a hand-edited URL never breaks the page; it just drops that filter.
function readNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || raw.trim() === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

// Turns the URL's search params into filters for the listings query.
export function parseListingFilters(searchParams: SearchParams): ListingFilters {
  let minPrice = readNumber(searchParams.minPrice);
  let maxPrice = readNumber(searchParams.maxPrice);
  // If the range is entered backwards (min above max), swap it instead of returning nothing.
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  const bedrooms = readNumber(searchParams.bedrooms);

  return {
    minPrice,
    maxPrice,
    bedrooms: bedrooms !== undefined && Number.isInteger(bedrooms) ? bedrooms : undefined,
    maxDistance: readNumber(searchParams.maxDistance),
  };
}

export function hasActiveFilters(filters: ListingFilters): boolean {
  return Object.values(filters).some((value) => value !== undefined);
}
