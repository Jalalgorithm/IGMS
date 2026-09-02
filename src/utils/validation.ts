export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** UK numbers, permissively: digits, spaces, dashes, brackets, optional +44. */
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

export const isBlank = (value: string | undefined | null): boolean =>
  !value || value.trim().length === 0;

export const isEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

export const isPhone = (value: string): boolean => PHONE_PATTERN.test(value.trim());

/** Collapses runs of whitespace and trims — what we send to the API. */
export const normalise = (value: string): string => value.trim().replace(/\s+/g, ' ');

export const hasErrors = <T,>(errors: ValidationErrors<T>): boolean =>
  Object.values(errors).some((message) => Boolean(message));
