// Rules for a submitted review. Used by the server action (the real check) and by the form
// (for its input limits), so both always agree.
export const MIN_RATING = 1;
export const MAX_RATING = 5;
export const MAX_COMMENT_LENGTH = 1000;

export type ParsedReview = { rating: number; comment: string };

export type ReviewParseResult = { ok: true; review: ParsedReview } | { ok: false; error: string };

// Checks the raw form values. Returns the cleaned review (comment trimmed), or the first problem
// found, worded for the user.
export function parseReview(
  rawRating: FormDataEntryValue | null,
  rawComment: FormDataEntryValue | null,
): ReviewParseResult {
  const ratingText = typeof rawRating === "string" ? rawRating.trim() : "";
  const rating = ratingText === "" ? NaN : Number(ratingText);
  if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    return { ok: false, error: `Choose a rating from ${MIN_RATING} to ${MAX_RATING} stars.` };
  }

  const comment = typeof rawComment === "string" ? rawComment.trim() : "";
  if (comment === "") return { ok: false, error: "Write a comment about your experience." };
  if (comment.length > MAX_COMMENT_LENGTH) {
    return {
      ok: false,
      error: `Comments can be at most ${MAX_COMMENT_LENGTH} characters (yours is ${comment.length}).`,
    };
  }

  return { ok: true, review: { rating, comment } };
}
