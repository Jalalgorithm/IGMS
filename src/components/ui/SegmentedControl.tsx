import { cn } from '@/utils/classNames';

interface SegmentedControlProps<T extends string> {
  legend: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

/**
 * Radio group styled as a segment bar. Uses real radios so arrow keys work
 * and the group announces "3 of 3" the way a visitor's screen reader expects.
 */
export const SegmentedControl = <T extends string>({
  legend,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) => (
  <fieldset className="border-0 p-0">
    <legend className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-charcoal">
      {legend}
    </legend>
    <div className="flex gap-1.5">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              'flex-1 cursor-pointer rounded-lg border px-2 py-2 text-center font-sans text-xs font-semibold transition-colors duration-150',
              selected
                ? 'border-charcoal bg-charcoal text-ivory'
                : 'border-sand bg-white text-charcoal hover:border-warm-grey',
            )}
          >
            <input
              type="radio"
              name={`segmented-${legend.replace(/\s+/g, '-').toLowerCase()}`}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  </fieldset>
);
