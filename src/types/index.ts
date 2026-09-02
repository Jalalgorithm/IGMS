/** Maturity of a thing on the page. Drives the single StatusChip component. */
export type StatusKind = 'live' | 'coming-soon' | 'description-only' | 'placeholder';

/** Shape every mocked service rejects with, so the UI has one error contract. */
export interface ApiErrorShape {
  message: string;
  /** Field-level messages, keyed by form field name. */
  fieldErrors?: Record<string, string>;
  status?: number;
}
