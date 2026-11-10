import { describe, expect, it } from "vitest";

import { MAX_COMMENT_LENGTH, parseReview } from "./review-validation";

describe("parseReview", () => {
  it("accepts a rating from 1 to 5 with a comment, and trims the comment", () => {
    expect(parseReview("4", "  Great place  ")).toEqual({
      ok: true,
      review: { rating: 4, comment: "Great place" },
    });
    expect(parseReview("1", "x").ok).toBe(true);
    expect(parseReview("5", "x").ok).toBe(true);
  });

  it.each([null, "", "0", "6", "-1", "3.5", "abc", "NaN", "Infinity"])(
    "rejects the rating %j",
    (rating) => {
      const result = parseReview(rating, "fine");
      expect(result.ok).toBe(false);
    },
  );

  it("rejects a missing, empty, or whitespace-only comment", () => {
    for (const comment of [null, "", "   ", "\n\t "]) {
      const result = parseReview("3", comment);
      expect(result).toEqual({ ok: false, error: "Write a comment about your experience." });
    }
  });

  it("allows a comment of exactly the limit and rejects one character more", () => {
    expect(parseReview("3", "a".repeat(MAX_COMMENT_LENGTH)).ok).toBe(true);
    const tooLong = parseReview("3", "a".repeat(MAX_COMMENT_LENGTH + 1));
    expect(tooLong.ok).toBe(false);
  });

  it("counts length after trimming", () => {
    expect(parseReview("3", ` ${"a".repeat(MAX_COMMENT_LENGTH)} `).ok).toBe(true);
  });

  it("ignores File values", () => {
    const file = new File(["x"], "x.txt");
    expect(parseReview(file, "ok").ok).toBe(false);
    expect(parseReview("3", file).ok).toBe(false);
  });
});
