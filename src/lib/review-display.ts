import { MAX_RATING } from "./review-validation";

// Dates are shown in Tallahassee time so a review posted at 11pm doesn't show as the next day
// just because the server runs in UTC.
const reviewDateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
});

// "Nov 12, 2026" from a Postgres timestamptz string.
export function formatReviewDate(createdAt: string): string {
  return reviewDateFormat.format(new Date(createdAt));
}

// "★★★★☆" for a whole-number rating. Screen readers get the aria-label instead.
export function ratingStars(rating: number): string {
  const filled = Math.max(0, Math.min(MAX_RATING, Math.round(rating)));
  return "★".repeat(filled) + "☆".repeat(MAX_RATING - filled);
}

// "1 review" / "3 reviews".
export function reviewCountLabel(count: number): string {
  return `${count} ${count === 1 ? "review" : "reviews"}`;
}
