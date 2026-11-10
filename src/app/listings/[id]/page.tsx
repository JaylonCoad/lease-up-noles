import Link from "next/link";
import { notFound } from "next/navigation";

import { ReviewForm } from "@/components/ReviewForm";
import { createClient } from "@/lib/supabase/server";

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

  // Only logged-in users get the review form, and only if they haven't reviewed this listing yet.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let hasReviewed = false;
  if (user) {
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("listing_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    hasReviewed = existing !== null;
  }

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
          {/* Real ratings arrive in Increment 2 (reviews). */}
          <dd className="text-lg font-semibold">No reviews yet</dd>
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
        ) : hasReviewed ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            You have already reviewed this listing.
          </p>
        ) : (
          <ReviewForm listingId={listing.id} />
        )}
      </section>
    </main>
  );
}
