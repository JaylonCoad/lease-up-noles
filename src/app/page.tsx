import { ListingCard } from "@/components/ListingCard";
import { ListingFilters } from "@/components/ListingFilters";
import { hasActiveFilters, parseListingFilters } from "@/lib/listing-filters";
import { getListings } from "@/lib/listings";

// Browse/search page (FR1): every listing, narrowed by the filters in the URL.
export default async function Home(props: PageProps<"/">) {
  const filters = parseListingFilters(await props.searchParams);
  const listings = await getListings(filters);
  const filtered = hasActiveFilters(filters);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Off-campus apartments in Tallahassee
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Prices are monthly rent per person. Distances are straight-line to FSU campus.
        </p>
      </header>

      <ListingFilters filters={filters} />

      <p className="mt-6 mb-3 text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        {listings.length} {listings.length === 1 ? "listing" : "listings"}
        {filtered ? " match your filters" : ""}
      </p>

      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {filtered
            ? "No listings match these filters. Try widening the price range or distance."
            : "No listings yet."}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
