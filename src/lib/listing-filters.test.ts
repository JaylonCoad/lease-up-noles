import { describe, expect, it } from "vitest";
import {
  bedroomsExpression,
  buildListingQuery,
  hasActiveFilters,
  parseListingFilters,
  PRICE_BOUNDS,
} from "./listing-filters";

describe("parseListingFilters", () => {
  it("returns no filters for an empty query", () => {
    expect(hasActiveFilters(parseListingFilters({}))).toBe(false);
  });

  it("ignores malformed and negative numbers", () => {
    const filters = parseListingFilters({ minPrice: "abc", maxPrice: "-5", maxDistance: " " });
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it("swaps a backwards range", () => {
    const filters = parseListingFilters({ minPrice: "1000", maxPrice: "500" });
    expect(filters).toMatchObject({ minPrice: 500, maxPrice: 1000 });
  });

  it("treats the ends of a slider as no filter", () => {
    const filters = parseListingFilters({
      minPrice: "0",
      maxPrice: String(PRICE_BOUNDS.max),
      minDistance: "0",
      maxDistance: "5",
    });
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it("clamps a minimum above the slider to its top", () => {
    expect(parseListingFilters({ minPrice: "9000" }).minPrice).toBe(PRICE_BOUNDS.max);
  });

  it("reads a distance range", () => {
    expect(parseListingFilters({ minDistance: "1", maxDistance: "2.5" })).toMatchObject({
      minDistance: 1,
      maxDistance: 2.5,
    });
  });

  it("reads one or many bedroom values", () => {
    expect(parseListingFilters({ bedrooms: "2" }).bedrooms).toEqual([2]);
    expect(parseListingFilters({ bedrooms: ["3", "0", "3"] }).bedrooms).toEqual([0, 3]);
  });

  it("collapses large bedroom counts into the top option and drops invalid ones", () => {
    expect(parseListingFilters({ bedrooms: ["7", "4", "1.5", "x"] }).bedrooms).toEqual([4]);
    expect(parseListingFilters({ bedrooms: "x" }).bedrooms).toBeUndefined();
  });
});

describe("bedroomsExpression", () => {
  it("matches exact counts", () => {
    expect(bedroomsExpression([0, 2])).toBe("bedrooms.in.(0,2)");
  });

  it("matches the top option and above", () => {
    expect(bedroomsExpression([4])).toBe("bedrooms.gte.4");
  });

  it("combines exact counts with the top option", () => {
    expect(bedroomsExpression([1, 4])).toBe("bedrooms.in.(1),bedrooms.gte.4");
  });
});

describe("buildListingQuery", () => {
  it("is empty for defaults", () => {
    expect(buildListingQuery({}, "price")).toBe("");
  });

  it("round-trips through parsing", () => {
    const query = buildListingQuery(
      { minPrice: 500, maxPrice: 1000, bedrooms: [1, 4], minDistance: 0.5, maxDistance: 2 },
      "rating",
    );
    const params = new URLSearchParams(query);
    const parsed = parseListingFilters({
      minPrice: params.get("minPrice") ?? undefined,
      maxPrice: params.get("maxPrice") ?? undefined,
      bedrooms: params.getAll("bedrooms"),
      minDistance: params.get("minDistance") ?? undefined,
      maxDistance: params.get("maxDistance") ?? undefined,
    });
    expect(parsed).toEqual({
      minPrice: 500,
      maxPrice: 1000,
      bedrooms: [1, 4],
      minDistance: 0.5,
      maxDistance: 2,
    });
    expect(params.get("sort")).toBe("rating");
  });
});
