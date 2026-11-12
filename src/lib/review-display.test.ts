import { describe, expect, it } from "vitest";

import { formatReviewDate, ratingStars, reviewCountLabel, reviewerLabel } from "./review-display";

describe("reviewerLabel", () => {
  it("uses the display name, trimmed", () => {
    expect(reviewerLabel("  Maria ")).toBe("Maria");
  });

  it("falls back for a missing or blank name", () => {
    expect(reviewerLabel(null)).toBe("Anonymous student");
    expect(reviewerLabel("   ")).toBe("Anonymous student");
  });
});

describe("formatReviewDate", () => {
  it("formats a timestamp as a short date", () => {
    expect(formatReviewDate("2026-11-12T15:00:00+00:00")).toBe("Nov 12, 2026");
  });

  it("uses Tallahassee time, not UTC", () => {
    // 2am UTC on Nov 13 is still 9pm on Nov 12 in Tallahassee.
    expect(formatReviewDate("2026-11-13T02:00:00+00:00")).toBe("Nov 12, 2026");
  });
});

describe("ratingStars", () => {
  it("fills one star per rating point", () => {
    expect(ratingStars(4)).toBe("★★★★☆");
    expect(ratingStars(1)).toBe("★☆☆☆☆");
    expect(ratingStars(5)).toBe("★★★★★");
  });

  it("clamps out-of-range values", () => {
    expect(ratingStars(0)).toBe("☆☆☆☆☆");
    expect(ratingStars(9)).toBe("★★★★★");
  });
});

describe("reviewCountLabel", () => {
  it("uses the singular for one review", () => {
    expect(reviewCountLabel(1)).toBe("1 review");
  });

  it("uses the plural otherwise", () => {
    expect(reviewCountLabel(0)).toBe("0 reviews");
    expect(reviewCountLabel(3)).toBe("3 reviews");
  });
});
