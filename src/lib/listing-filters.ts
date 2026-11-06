import type { ListingFilters, ListingSort } from "@/types/listing";

import { DEFAULT_SORT } from "./listing-sort";

// The bedroom filter's top option. Choosing it matches this many bedrooms or more ("4+").
export const MAX_BEDROOM_OPTION = 4;

export type RangeBounds = { min: number; max: number; step: number };

// Slider limits. The top of each slider means "no upper limit", so a listing priced or
// located beyond it is never hidden while the slider is left at its default.
export const PRICE_BOUNDS: RangeBounds = { min: 0, max: 2500, step: 25 };
export const DISTANCE_BOUNDS: RangeBounds = { min: 0, max: 5, step: 0.5 };

type SearchParams = { [key: string]: string | string[] | undefined };

// Reads a non-negative number from a search param. Blank, malformed, or negative values
// are ignored, so a hand-edited URL never breaks the page; it just drops that filter.
function parseNumber(raw: string | undefined): number | undefined {
  if (raw === undefined || raw.trim() === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function readNumber(value: string | string[] | undefined): number | undefined {
  return parseNumber(Array.isArray(value) ? value[0] : value);
}

// Reads a min/max pair. A backwards range is swapped instead of returning nothing, and a value
// at the end of the slider is dropped because it doesn't narrow anything.
function readRange(
  minValue: string | string[] | undefined,
  maxValue: string | string[] | undefined,
  bounds: RangeBounds,
): { min?: number; max?: number } {
  let min = readNumber(minValue);
  let max = readNumber(maxValue);
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];

  return {
    min: min === undefined || min <= bounds.min ? undefined : Math.min(min, bounds.max),
    max: max === undefined || max >= bounds.max ? undefined : max,
  };
}

// Bedroom filters repeat in the URL (?bedrooms=1&bedrooms=2). Anything that isn't a whole number
// is ignored, and values above the top option collapse into it ("4+").
function readBedrooms(value: string | string[] | undefined): number[] | undefined {
  const values = (Array.isArray(value) ? value : [value])
    .map((raw) => parseNumber(raw))
    .filter((parsed): parsed is number => parsed !== undefined && Number.isInteger(parsed))
    .map((parsed) => Math.min(parsed, MAX_BEDROOM_OPTION));
  const unique = [...new Set(values)].sort((a, b) => a - b);
  return unique.length > 0 ? unique : undefined;
}

// Turns the URL's search params into filters for the listings query.
export function parseListingFilters(searchParams: SearchParams): ListingFilters {
  const price = readRange(searchParams.minPrice, searchParams.maxPrice, PRICE_BOUNDS);
  const distance = readRange(searchParams.minDistance, searchParams.maxDistance, DISTANCE_BOUNDS);

  return {
    minPrice: price.min,
    maxPrice: price.max,
    bedrooms: readBedrooms(searchParams.bedrooms),
    minDistance: distance.min,
    maxDistance: distance.max,
  };
}

export function hasActiveFilters(filters: ListingFilters): boolean {
  return Object.values(filters).some((value) => value !== undefined);
}

// Builds the PostgREST "or" expression for the selected bedroom options, e.g.
// [1, 2, 4] -> "bedrooms.in.(1,2),bedrooms.gte.4".
export function bedroomsExpression(bedrooms: number[]): string {
  const exact = bedrooms.filter((count) => count < MAX_BEDROOM_OPTION);
  const parts: string[] = [];
  if (exact.length > 0) parts.push(`bedrooms.in.(${exact.join(",")})`);
  if (bedrooms.includes(MAX_BEDROOM_OPTION)) parts.push(`bedrooms.gte.${MAX_BEDROOM_OPTION}`);
  return parts.join(",");
}

// The inverse of parsing: the query string for a set of filters and a sort. Defaults are left
// out, so the same selection always produces the same string.
export function buildListingQuery(filters: ListingFilters, sort: ListingSort): string {
  const params = new URLSearchParams();
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  for (const count of filters.bedrooms ?? []) params.append("bedrooms", String(count));
  if (filters.minDistance !== undefined) params.set("minDistance", String(filters.minDistance));
  if (filters.maxDistance !== undefined) params.set("maxDistance", String(filters.maxDistance));
  if (sort !== DEFAULT_SORT) params.set("sort", sort);
  return params.toString();
}
