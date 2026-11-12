import Link from "next/link";
import { notFound } from "next/navigation";

import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { averageRating } from "@/lib/listing-sort";
import { reviewCountLabel } from "@/lib/review-display";
import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/types/review";

// One row from the listings table
type Listing = {
  id: string;
  name: string;
  price: number;
  bedrooms: number;
  address: string;
  amenities: string[];
  distance_miles: number | null;
};

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function bedroomLabel(bedrooms: number): string {
  if (bedrooms === 0) return "Studio";
  return `${bedrooms} bed${bedrooms === 1 ? "" : "s"}`;
}

// GET /listings/[id]: shows every detail for one listing.
export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();

  // Bad id or no matching listing -> show the 404 page.
  if (error || !data) notFound();

  const listing = { ...data, price: Number(data.price) } as Listing;

  // Every review for this listing, newest first. Reviews are publicly readable (RLS), so this
  // works for guests too. If they can't be loaded, the listing still shows and the reviews
  // section says so, rather than pretending there are none.
  const { data: reviewRows, error: reviewsError } = await supabase
    .from("reviews")
    .select("id, listing_id, user_id, rating, comment, created_at")
    .eq("listing_id", id)
    .order("created_at", { ascending: false });
  if (reviewsError) console.error(`Could not load reviews: ${reviewsError.message}`);
  const reviews: Review[] | null = reviewsError ? null : (reviewRows ?? []);

  // Recomputed from the reviews on every request, so a new review moves the average right away.
  const average = reviews ? averageRating(reviews.map((review) => review.rating)) : null;

  // Only logged-in users get the review form, and only if they haven't reviewed this listing yet.
  // The reviews above already include theirs if it exists, so no second query is needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const hasReviewed = user !== null && (reviews ?? []).some((review) => review.user_id === user.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{listing.name}</h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{listing.address}</p>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs text-zinc-500">Rent</dt>
          <dd className="text-lg font-semibold">{priceFormat.format(listing.price)}</dd>
          <dd className="text-xs text-zinc-500">per person / mo</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Bedrooms</dt>
          <dd className="text-lg font-semibold">{bedroomLabel(listing.bedrooms)}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Distance to campus</dt>
          <dd className="text-lg font-semibold">
            {listing.distance_miles === null
              ? "Unavailable"
              : `${listing.distance_miles.toFixed(1)} mi`}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Rating</dt>
          {reviews === null ? (
            <dd className="text-lg font-semibold">Unavailable</dd>
          ) : average === null ? (
            <dd className="text-lg font-semibold">No reviews yet</dd>
          ) : (
            <>
              <dd className="text-lg font-semibold">
                <span className="text-amber-500" aria-hidden>
                  ★
                </span>{" "}
                {average.toFixed(1)}
              </dd>
              <dd className="text-xs text-zinc-500">{reviewCountLabel(reviews.length)}</dd>
            </>
          )}
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Amenities</h2>
        {listing.amenities.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {listing.amenities.map((amenity) => (
              <li
                key={amenity}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {amenity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">No amenities listed.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Leave a review</h2>
        {!user ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/login" className="underline">
              Log in
            </Link>{" "}
            or{" "}
            <Link href="/signup" className="underline">
              sign up
            </Link>{" "}
            to review this place.
          </p>
        ) : (
          <ReviewForm listingId={listing.id} alreadyReviewed={hasReviewed} />
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          Reviews{reviews && reviews.length > 0 ? ` (${reviews.length})` : ""}
        </h2>
        {reviews === null ? (
          <p className="mt-2 text-sm text-red-600">Reviews couldn&apos;t be loaded right now.</p>
        ) : (
          <ReviewList reviews={reviews} />
        )}
      </section>
    </main>
  );
}
