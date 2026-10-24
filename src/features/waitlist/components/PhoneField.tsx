import { useId } from 'react';
import { cn } from '@/utils/classNames';
import {
  COUNTRIES,
  isCountryCode,
  SUPPORTS_FLAG_EMOJI,
  type CountryCode,
} from '../services/countries';

const CONTROL =
  'rounded-xl border bg-white py-3 font-sans text-base text-charcoal transition-colors duration-150';


interface PhoneFieldProps {
  country: CountryCode;
  number: string;
  onCountryChange: (country: CountryCode) => void;
  onNumberChange: (value: string) => void;
  onBlur: () => void;
  hint?: string;
  error?: string;
}

/**
 * Country code + national number. The closed control shows "🇬🇧 +44" (or just
 * "+44" where the device has no flag emoji); the open list, and a screen
 * reader, get the full country name.
 */
export const PhoneField = ({
  country,
  number,
  onCountryChange,
  onNumberChange,
  onBlur,
  hint,
  error,
}: PhoneFieldProps) => {
  const id = 'waitlist-phone';
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const countryId = useId();
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');
  const selected = COUNTRIES.find((option) => option.code === country);
  const border = error ? 'border-terracotta' : 'border-sand hover:border-warm-grey';

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-sans text-sm font-semibold text-charcoal">
        Phone number
        <span className="ml-2 font-normal text-warm-grey">(optional)</span>
      </label>

      {hint ? (
        <p id={hintId} className="font-sans text-sm leading-relaxed text-warm-grey">
          {hint}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <label htmlFor={countryId} className="sr-only">
          Country code
        </label>
        {/* The native select stays focusable and readable by assistive tech,
            but is transparent: the visible face shows only flag and code so
            a long country name never gets clipped mid-word. */}
        <div
          className={cn(
            CONTROL,
            border,
            'relative flex w-[6.5rem] shrink-0 items-center gap-2 px-3 focus-within:outline focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-terracotta',
          )}
        >
          {SUPPORTS_FLAG_EMOJI ? (
            <span aria-hidden="true" className="text-lg leading-none">
              {selected?.flag}
            </span>
          ) : null}
          <span aria-hidden="true">{selected?.dialCode}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="ml-auto size-3.5 shrink-0 text-warm-grey"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6l5 5 5-5" />
          </svg>
          <select
            id={countryId}
            name="phoneCountry"
            value={country}
            onChange={(event) => {
              if (isCountryCode(event.target.value)) onCountryChange(event.target.value);
            }}
            autoComplete="tel-country-code"
            className="absolute inset-0 size-full cursor-pointer opacity-0 focus:outline-none"
          >
            {COUNTRIES.map((option) => (
              <option key={option.code} value={option.code}>
                {`${SUPPORTS_FLAG_EMOJI ? `${option.flag} ` : ''}${option.name} (${option.dialCode})`}
              </option>
            ))}
          </select>
        </div>

        <input
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          maxLength={20}
          value={number}
          onChange={(event) => onNumberChange(event.target.value)}
          onBlur={onBlur}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          placeholder="7911 123456"
          className={cn(CONTROL, border, 'min-w-[6rem] flex-1 px-3 sm:px-4 placeholder:text-warm-grey/70')}
        />
      </div>

      {error ? (
        <p id={errorId} className="font-sans text-sm font-medium text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
};
