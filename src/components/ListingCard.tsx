import Link from "next/link";

import type { Listing } from "@/types/listing";

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function bedroomLabel(bedrooms: number): string {
  if (bedrooms === 0) return "Studio";
  return `${bedrooms} bed${bedrooms === 1 ? "" : "s"}`;
}

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="relative flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-zinc-500 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {/* The ::after overlay stretches this link over the whole card. */}
          <Link
            href={`/listings/${listing.id}`}
            className="after:absolute after:inset-0 after:rounded-lg focus:outline-none"
          >
            {listing.name}
          </Link>
        </h2>
        <p className="shrink-0 text-right">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {priceFormat.format(listing.price)}
          </span>
          <span className="block text-xs text-zinc-500">per person / mo</span>
        </p>
      </div>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{listing.address}</p>
      <p className="mt-3 text-sm text-zinc-800 dark:text-zinc-200">
        {bedroomLabel(listing.bedrooms)}
        <span className="mx-2 text-zinc-400" aria-hidden>
          ·
        </span>
        {`${listing.distance_miles.toFixed(1)} mi to campus`}
      </p>
      {listing.amenities.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-3" aria-label="Amenities">
          {listing.amenities.map((amenity) => (
            <li
              key={amenity}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {amenity}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
