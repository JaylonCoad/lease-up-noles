"use client";

import { useActionState, useState } from "react";

import { submitReview } from "@/app/listings/[id]/actions";
import { MAX_COMMENT_LENGTH, MAX_RATING, MIN_RATING } from "@/lib/review-validation";

const STAR_VALUES = Array.from({ length: MAX_RATING - MIN_RATING + 1 }, (_, i) => MIN_RATING + i);

// Form for a logged-in student to review one listing. The server action does the real
// validation; the input limits here just save a round trip.
export function ReviewForm({
  listingId,
  alreadyReviewed,
}: {
  listingId: string;
  alreadyReviewed: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitReview, undefined);
  // Live length for the counter. There is no maxLength on the box on purpose: it would silently
  // cut off pasted text. The server rejects anything over the limit and says so.
  const [commentLength, setCommentLength] = useState(0);
  const overLimit = commentLength > MAX_COMMENT_LENGTH;

  // After a successful post the page re-renders with alreadyReviewed = true. This component stays
  // mounted, so the thank-you below still shows instead of being replaced.
  if (state?.message) return <p className="mt-2 text-sm text-green-700">{state.message}</p>;
  if (alreadyReviewed) {
    return (
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        You have already reviewed this listing.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-4">
      <input type="hidden" name="listingId" value={listingId} />

      <fieldset className="flex flex-col gap-1 text-sm">
        <legend className="mb-1">Rating</legend>
        <div className="flex flex-wrap gap-4">
          {STAR_VALUES.map((value) => (
            <label key={value} className="flex items-center gap-1">
              <input type="radio" name="rating" value={value} required />
              {value} {value === 1 ? "star" : "stars"}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm">
        Comment
        <textarea
          name="comment"
          required
          rows={4}
          onChange={(event) => setCommentLength(event.target.value.length)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <span className={`text-xs ${overLimit ? "text-red-600" : "text-zinc-500"}`}>
          {commentLength} / {MAX_COMMENT_LENGTH} characters
        </span>
      </label>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? "Posting..." : "Post review"}
      </button>
    </form>
  );
}
