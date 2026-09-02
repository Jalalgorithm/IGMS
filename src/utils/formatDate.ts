const LOCALE = 'en-GB';

/** e.g. "31 August 2026" */
export const formatDate = (value: Date | string | number): string =>
  new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));

/** e.g. "31 August 2026 at 14:05" */
export const formatDateTime = (value: Date | string | number): string =>
  new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
