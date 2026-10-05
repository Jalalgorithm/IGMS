import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js/min';

export type { CountryCode };

export interface CountryOption {
  readonly code: CountryCode;
  readonly name: string;
  readonly dialCode: string;
  readonly flag: string;
}

export const DEFAULT_COUNTRY: CountryCode = 'GB';

/** Regional-indicator pair for an ISO 3166 code — "GB" becomes the UK flag. */
const toFlag = (code: string): string =>
  String.fromCodePoint(...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));

const names = new Intl.DisplayNames(['en-GB'], { type: 'region' });

/**
 * Every country libphonenumber can validate, named in British English and
 * sorted alphabetically, with the UK pinned first — most visitors are here.
 */
export const COUNTRIES: readonly CountryOption[] = (() => {
  const all = getCountries().map((code) => ({
    code,
    name: names.of(code) ?? code,
    dialCode: `+${getCountryCallingCode(code)}`,
    flag: toFlag(code),
  }));
  all.sort((a, b) => a.name.localeCompare(b.name, 'en-GB'));
  const uk = all.findIndex((country) => country.code === DEFAULT_COUNTRY);
  if (uk > 0) all.unshift(...all.splice(uk, 1));
  return all;
})();

const KNOWN = new Set<string>(COUNTRIES.map((country) => country.code));

export const isCountryCode = (value: string): value is CountryCode => KNOWN.has(value);

/**
 * The number in E.164 ("+447700900123") if it is a valid number for that
 * country, otherwise null. A number typed with its own "+" prefix is read as
 * international and checked against that prefix instead.
 */
export const toE164 = (national: string, country: CountryCode): string | null => {
  const parsed = parsePhoneNumberFromString(national.trim(), country);
  return parsed?.isValid() ? parsed.number : null;
};
