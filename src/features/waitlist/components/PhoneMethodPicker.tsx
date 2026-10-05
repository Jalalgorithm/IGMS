import { useId } from 'react';
import { cn } from '@/utils/classNames';
import type { PhoneMethod } from '../types';

const METHODS: ReadonlyArray<{ value: PhoneMethod; label: string }> = [
  { value: 'call', label: 'Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

interface PhoneMethodPickerProps {
  selected: readonly PhoneMethod[];
  onToggle: (method: PhoneMethod) => void;
  onBlur: () => void;
  error?: string;
}

/** Call and/or WhatsApp — which of the two the number given may be used for. */
export const PhoneMethodPicker = ({
  selected,
  onToggle,
  onBlur,
  error,
}: PhoneMethodPickerProps) => {
  const groupId = useId();
  const errorId = `${groupId}-error`;

  return (
    <fieldset
      className="m-0 border-0 p-0"
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-2 font-sans text-sm font-medium text-charcoal">
        How should we use this number?
      </legend>
      <div className="flex flex-wrap gap-3">
        {METHODS.map(({ value, label }) => {
          const id = `${groupId}-${value}`;
          const checked = selected.includes(value);
          return (
            <label
              key={value}
              htmlFor={id}
              className={cn(
                'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-2 font-sans text-sm font-medium text-charcoal transition-colors focus-within:border-terracotta',
                checked
                  ? 'border-terracotta bg-terracotta/8'
                  : 'border-sand bg-white hover:border-warm-grey',
                error && !checked ? 'border-terracotta' : null,
              )}
            >
              <input
                type="checkbox"
                id={id}
                name="phoneMethods"
                value={value}
                checked={checked}
                onChange={() => onToggle(value)}
                onBlur={onBlur}
                className="size-5 shrink-0 cursor-pointer accent-[var(--color-terracotta)]"
              />
              {label}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} className="m-0 mt-2 font-sans text-sm font-medium text-terracotta">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
};
