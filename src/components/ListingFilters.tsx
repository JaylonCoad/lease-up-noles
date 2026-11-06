"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { RangeSlider } from "@/components/RangeSlider";
import {
  buildListingQuery,
  DISTANCE_BOUNDS,
  MAX_BEDROOM_OPTION,
  PRICE_BOUNDS,
} from "@/lib/listing-filters";
import { DEFAULT_SORT, SORT_OPTIONS } from "@/lib/listing-sort";
import type { ListingFilters as Filters, ListingSort } from "@/types/listing";

const BEDROOM_OPTIONS = [
  { value: 0, label: "Studio" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: MAX_BEDROOM_OPTION, label: `${MAX_BEDROOM_OPTION}+` },
];

// How long to wait after the last change before updating the results, so dragging a slider
// doesn't run a query for every step it passes through.
const UPDATE_DELAY_MS = 250;

const labelClass = "mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400";
const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatPrice = (value: number) => priceFormat.format(value);
const formatDistance = (value: number) => `${value} mi`;

type Selection = { filters: Filters; sort: ListingSort };

function toHref(query: string): string {
  return query ? `/?${query}` : "/";
}

// Filter and sort bar for the browse page. The URL holds the applied selection, so results stay
// shareable and survive going back from a listing. Changes apply as they're made; without
// JavaScript it's still a plain GET form with an Apply button.
export function ListingFilters({ filters, sort }: { filters: Filters; sort: ListingSort }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Changes the URL hasn't caught up with yet. While set, it wins over the props, so a slow
  // response can't move a slider out from under someone still dragging it.
  const [draft, setDraft] = useState<Selection | null>(null);

  const appliedQuery = buildListingQuery(filters, sort);
  const draftQuery = draft ? buildListingQuery(draft.filters, draft.sort) : null;
  if (draftQuery === appliedQuery) setDraft(null);

  const current = draft ?? { filters, sort };
  const update = (changes: Partial<Filters>) =>
    setDraft({ ...current, filters: { ...current.filters, ...changes } });

  useEffect(() => {
    if (draftQuery === null) return;
    const timer = setTimeout(() => {
      startTransition(() => router.replace(toHref(draftQuery), { scroll: false }));
    }, UPDATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [draftQuery, router]);

  const toggleBedrooms = (count: number, checked: boolean) => {
    const others = (current.filters.bedrooms ?? []).filter((value) => value !== count);
    const next = (checked ? [...others, count] : others).sort((a, b) => a - b);
    update({ bedrooms: next.length > 0 ? next : undefined });
  };

  return (
    <form
      action="/"
      aria-busy={isPending}
      className="grid gap-x-6 gap-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <RangeSlider
        label="Price per month"
        minName="minPrice"
        maxName="maxPrice"
        bounds={PRICE_BOUNDS}
        low={current.filters.minPrice}
        high={current.filters.maxPrice}
        format={formatPrice}
        onChange={(minPrice, maxPrice) => update({ minPrice, maxPrice })}
      />
      <RangeSlider
        label="Distance to campus"
        minName="minDistance"
        maxName="maxDistance"
        bounds={DISTANCE_BOUNDS}
        low={current.filters.minDistance}
        high={current.filters.maxDistance}
        format={formatDistance}
        onChange={(minDistance, maxDistance) => update({ minDistance, maxDistance })}
      />
      <fieldset className="min-w-0">
        <legend className={labelClass}>Bedrooms</legend>
        <div className="flex flex-wrap gap-1.5">
          {BEDROOM_OPTIONS.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="checkbox"
                name="bedrooms"
                value={option.value}
                checked={current.filters.bedrooms?.includes(option.value) ?? false}
                onChange={(event) => toggleBedrooms(option.value, event.target.checked)}
                className="peer sr-only"
              />
              <span className="block rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-800 peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-500 peer-focus-visible:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:peer-checked:border-zinc-100 dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="min-w-0">
        <label htmlFor="sort" className={labelClass}>
          Sort by
        </label>
        <select
          id="sort"
          name="sort"
          value={current.sort}
          onChange={(event) => setDraft({ ...current, sort: event.target.value as ListingSort })}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
        <noscript>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Apply
          </button>
        </noscript>
        {/* Clears the filters but keeps the sort order. Dropping the draft cancels any pending update. */}
        <Link
          href={toHref(current.sort === DEFAULT_SORT ? "" : `sort=${current.sort}`)}
          scroll={false}
          onClick={() => setDraft(null)}
          className="text-sm font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          Clear filters
        </Link>
        {isPending && <span className="text-xs text-zinc-500">Updating…</span>}
      </div>
    </form>
  );
}
