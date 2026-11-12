import { formatReviewDate, ratingStars } from "@/lib/review-display";
import { MAX_RATING } from "@/lib/review-validation";
import type { Review } from "@/types/review";

// Every review for one listing, in the order given (the page passes newest first).
export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="mt-2 text-sm text-zinc-500">
        No reviews yet. Be the first to review this place.
      </p>
    );
  }

  return (
    <ul className="mt-3 flex flex-col gap-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <span
              className="text-amber-500"
              role="img"
              aria-label={`${review.rating} out of ${MAX_RATING} stars`}
            >
              {ratingStars(review.rating)}
            </span>
            <time dateTime={review.created_at} className="text-xs text-zinc-500">
              {formatReviewDate(review.created_at)}
            </time>
          </div>
          {/* whitespace-pre-line keeps the reviewer's line breaks. */}
          <p className="mt-2 text-sm whitespace-pre-line text-zinc-800 dark:text-zinc-200">
            {review.comment}
          </p>
        </li>
      ))}
    </ul>
  );
}
