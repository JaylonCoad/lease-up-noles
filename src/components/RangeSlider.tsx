import type { RangeBounds } from "@/lib/listing-filters";

// Two native range inputs stacked on one track. Only the thumbs take pointer events, so either
// can be dragged, and each one keeps native keyboard and screen reader support.
const thumbClass =
  "pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-zinc-900 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-zinc-900 focus-visible:[&::-moz-range-thumb]:ring-2 focus-visible:[&::-moz-range-thumb]:ring-zinc-500 focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-zinc-500 dark:[&::-moz-range-thumb]:border-zinc-900 dark:[&::-moz-range-thumb]:bg-zinc-100 dark:[&::-webkit-slider-thumb]:border-zinc-900 dark:[&::-webkit-slider-thumb]:bg-zinc-100";

type RangeSliderProps = {
  label: string;
  minName: string;
  maxName: string;
  bounds: RangeBounds;
  // undefined means that end of the range is unset, which puts the thumb at the end of the track.
  low: number | undefined;
  high: number | undefined;
  format: (value: number) => string;
  // Reports undefined for a thumb that's back at the end of the track.
  onChange: (low: number | undefined, high: number | undefined) => void;
};

export function RangeSlider({
  label,
  minName,
  maxName,
  bounds,
  low,
  high,
  format,
  onChange,
}: RangeSliderProps) {
  const lowValue = Math.max(bounds.min, Math.min(low ?? bounds.min, bounds.max));
  const highValue = Math.max(lowValue, Math.min(high ?? bounds.max, bounds.max));
  const percent = (value: number) => ((value - bounds.min) / (bounds.max - bounds.min)) * 100;
  const highText = highValue >= bounds.max ? `${format(bounds.max)}+` : format(highValue);

  const emit = (nextLow: number, nextHigh: number) =>
    onChange(
      nextLow <= bounds.min ? undefined : nextLow,
      nextHigh >= bounds.max ? undefined : nextHigh,
    );

  return (
    <fieldset className="min-w-0">
      <legend className="mb-1 flex w-full justify-between gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        <span>{label}</span>
        <span className="text-zinc-900 tabular-nums dark:text-zinc-100">
          {format(lowValue)} – {highText}
        </span>
      </legend>
      <div className="relative mt-2 h-5">
        <div className="absolute inset-x-0 top-2 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div
          className="absolute top-2 h-1 rounded-full bg-zinc-900 dark:bg-zinc-100"
          style={{ left: `${percent(lowValue)}%`, right: `${100 - percent(highValue)}%` }}
        />
        <input
          type="range"
          name={minName}
          aria-label={`Minimum ${label.toLowerCase()}`}
          aria-valuetext={format(lowValue)}
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={lowValue}
          onChange={(event) => emit(Math.min(Number(event.target.value), highValue), highValue)}
          // When both thumbs meet at the top of the track, the low one has to be on top or
          // neither could be moved.
          style={{ zIndex: percent(lowValue) > 50 ? 2 : 1 }}
          className={thumbClass}
        />
        <input
          type="range"
          name={maxName}
          aria-label={`Maximum ${label.toLowerCase()}`}
          aria-valuetext={highText}
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={highValue}
          onChange={(event) => emit(lowValue, Math.max(Number(event.target.value), lowValue))}
          style={{ zIndex: percent(lowValue) > 50 ? 1 : 2 }}
          className={thumbClass}
        />
      </div>
    </fieldset>
  );
}
