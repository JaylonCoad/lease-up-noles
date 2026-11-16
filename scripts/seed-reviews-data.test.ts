import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { parseReview } from "../src/lib/review-validation";
import { seedReviews, seedStudents } from "./seed-reviews-data";

const listingSource = readFileSync(new URL("./seed-listings.ts", import.meta.url), "utf8");

describe("seed review data", () => {
  it("only uses ratings and comments the app itself would accept", () => {
    for (const review of seedReviews) {
      expect(parseReview(String(review.rating), review.comment).ok).toBe(true);
    }
  });

  it("refers to listings that exist in the listing seed data", () => {
    for (const review of seedReviews) {
      expect(listingSource).toContain(`name: "${review.listingName}"`);
    }
  });

  it("refers to students that are defined", () => {
    const emails = new Set(seedStudents.map((student) => student.email));
    for (const review of seedReviews) expect(emails.has(review.studentEmail)).toBe(true);
  });

  it("has at most one review per student per listing, as the database requires", () => {
    const pairs = seedReviews.map((review) => `${review.listingName}|${review.studentEmail}`);
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it("uses only reserved example addresses and unique student emails", () => {
    const emails = seedStudents.map((student) => student.email);
    expect(new Set(emails).size).toBe(emails.length);
    for (const email of emails) expect(email.endsWith("@seed.example.com")).toBe(true);
  });

  it("spreads reviews across several listings with a mix of ratings", () => {
    expect(new Set(seedReviews.map((review) => review.listingName)).size).toBeGreaterThanOrEqual(6);
    expect(new Set(seedReviews.map((review) => review.rating)).size).toBeGreaterThanOrEqual(3);
  });
});
