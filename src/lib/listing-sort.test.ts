import { describe, expect, it } from "vitest";
import type { RatedListing } from "@/types/listing";
import { averageRating, parseListingSort, sortListings } from "./listing-sort";

function listing(id: string, fields: Partial<RatedListing> = {}): RatedListing {
  return {
    id,
    name: id,
    price: 1000,
    bedrooms: 1,
    address: "1 Main St",
    amenities: [],
    lat: 30,
    lng: -84,
    distance_miles: 1,
    created_at: "2026-01-01T00:00:00Z",
    average_rating: null,
    review_count: 0,
    ...fields,
  };
}

const ids = (listings: RatedListing[]) => listings.map((item) => item.id);

describe("parseListingSort", () => {
  it("accepts known values", () => {
    expect(parseListingSort("distance")).toBe("distance");
    expect(parseListingSort("rating")).toBe("rating");
  });

  it("falls back to price for missing or unknown values", () => {
    expect(parseListingSort(undefined)).toBe("price");
    expect(parseListingSort("nonsense")).toBe("price");
  });
});

describe("averageRating", () => {
  it("is null with no ratings", () => {
    expect(averageRating([])).toBeNull();
  });

  it("averages the ratings", () => {
    expect(averageRating([5, 4, 3])).toBe(4);
  });
});

describe("sortListings", () => {
  it("sorts by price ascending", () => {
    const sorted = sortListings(
      [listing("a", { price: 900 }), listing("b", { price: 700 })],
      "price",
    );
    expect(ids(sorted)).toEqual(["b", "a"]);
  });

  it("sorts by distance, closest first", () => {
    const sorted = sortListings(
      [listing("a", { distance_miles: 2 }), listing("b", { distance_miles: 0.5 })],
      "distance",
    );
    expect(ids(sorted)).toEqual(["b", "a"]);
  });

  it("sorts by rating, highest first, with unreviewed listings last", () => {
    const sorted = sortListings(
      [
        listing("none", { price: 1 }),
        listing("low", { average_rating: 2 }),
        listing("high", { average_rating: 4.5 }),
      ],
      "rating",
    );
    expect(ids(sorted)).toEqual(["high", "low", "none"]);
  });

  it("orders ties by price, then name", () => {
    const sorted = sortListings(
      [
        listing("c", { average_rating: 4, price: 900 }),
        listing("b", { average_rating: 4, price: 800 }),
        listing("a", { average_rating: 4, price: 900 }),
      ],
      "rating",
    );
    expect(ids(sorted)).toEqual(["b", "a", "c"]);
  });

  it("keeps the same relative order when other listings are filtered out", () => {
    const all = [
      listing("a", { distance_miles: 1, price: 800 }),
      listing("b", { distance_miles: 1, price: 700 }),
      listing("c", { distance_miles: 0.5 }),
    ];
    const reversed = [...all].reverse();
    expect(ids(sortListings(all, "distance"))).toEqual(ids(sortListings(reversed, "distance")));
    expect(ids(sortListings(all.slice(0, 2), "distance"))).toEqual(["b", "a"]);
  });

  it("does not change the input array", () => {
    const input = [listing("a", { price: 2 }), listing("b", { price: 1 })];
    sortListings(input, "price");
    expect(ids(input)).toEqual(["a", "b"]);
  });
});
