import { describe, expect, it } from "vitest";
import {
    haversineMiles,
    distanceToCampusMiles,
  } from "./distance";

describe("haversineMiles", () => {
  it("returns zero for identical coordinates", () => {
    expect(haversineMiles(30.44, -84.29, 30.44, -84.29)).toBe(0);
  });

  it("returns about 69.09 miles for one degree at the equator", () => {
    expect(haversineMiles(0, 0, 0, 1)).toBeCloseTo(69.09, 1);
  });

  it("returns the same distance in either direction", () => {
    const forward = haversineMiles(30.44, -84.29, 30.50, -84.35);
    const reverse = haversineMiles(30.50, -84.35, 30.44, -84.29);

    expect(forward).toBeCloseTo(reverse, 10);
  });

  it("rejects invalid latitude", () => {
    expect(() => haversineMiles(91, 0, 0, 0)).toThrow();
  });

  it("rejects invalid longitude", () => {
    expect(() => haversineMiles(0, 181, 0, 0)).toThrow();
  });

  it("rejects non-finite coordinates", () => {
    expect(() => haversineMiles(NaN, 0, 0, 0)).toThrow();
    expect(() => haversineMiles(0, Infinity, 0, 0)).toThrow();
  });
});

describe("distanceToCampusMiles", () => {
    it("returns zero at the fixed Westcott Fountain reference point", () => {
      expect(distanceToCampusMiles(30.44072, -84.29115)).toBe(0);
    });
  
    it("returns about 69.09 miles one degree north of Westcott", () => {
      expect(distanceToCampusMiles(31.44072, -84.29115))
        .toBeCloseTo(69.09, 1);
    });
  });