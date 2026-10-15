import Form from "next/form";
import Link from "next/link";

import { MAX_BEDROOM_OPTION } from "@/lib/listing-filters";
import type { ListingFilters as Filters } from "@/types/listing";

const BEDROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "0", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: String(MAX_BEDROOM_OPTION), label: `${MAX_BEDROOM_OPTION}+` },
];

const DISTANCE_OPTIONS = [
  { value: "", label: "Any distance" },
  { value: "0.5", label: "Within 0.5 mi" },
  { value: "1", label: "Within 1 mi" },
  { value: "2", label: "Within 2 mi" },
  { value: "3", label: "Within 3 mi" },
  { value: "5", label: "Within 5 mi" },
];

const fieldClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
const labelClass = "mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400";

// Filter bar for the browse page. Submitting updates the URL search params (GET),
// so filtered results are shareable and work without JavaScript.
export function ListingFilters({ filters }: { filters: Filters }) {
  return (
    // Keyed on the filters so the uncontrolled inputs pick up new defaults after "Clear".
    <Form
      key={JSON.stringify(filters)}
      action="/"
      className="grid grid-cols-2 gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="min-w-0">
        <label htmlFor="minPrice" className={labelClass}>
          Min price ($/mo)
        </label>
        <input
          id="minPrice"
          name="minPrice"
          type="number"
          min={0}
          step={25}
          inputMode="numeric"
          placeholder="No min"
          defaultValue={filters.minPrice}
          className={fieldClass}
        />
      </div>
      <div className="min-w-0">
        <label htmlFor="maxPrice" className={labelClass}>
          Max price ($/mo)
        </label>
        <input
          id="maxPrice"
          name="maxPrice"
          type="number"
          min={0}
          step={25}
          inputMode="numeric"
          placeholder="No max"
          defaultValue={filters.maxPrice}
          className={fieldClass}
        />
      </div>
      <div className="min-w-0">
        <label htmlFor="bedrooms" className={labelClass}>
          Bedrooms
        </label>
        <select
          id="bedrooms"
          name="bedrooms"
          defaultValue={filters.bedrooms === undefined ? "" : String(filters.bedrooms)}
          className={fieldClass}
        >
          {BEDROOM_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-0">
        <label htmlFor="maxDistance" className={labelClass}>
          Distance to campus
        </label>
        <select
          id="maxDistance"
          name="maxDistance"
          defaultValue={filters.maxDistance === undefined ? "" : String(filters.maxDistance)}
          className={fieldClass}
        >
          {DISTANCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2 flex gap-2 sm:col-span-4 lg:col-span-1">
        <button
          type="submit"
          className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 lg:flex-none dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Apply
        </button>
        <Link
          href="/"
          className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-100 lg:flex-none dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Clear
        </Link>
      </div>
    </Form>
  );
}
