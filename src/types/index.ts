/** Maturity of a thing on the page. Drives the single StatusChip component. */
export type StatusKind = 'live' | 'coming-soon' | 'description-only' | 'placeholder';

/** Shape every mocked service rejects with, so the UI has one error contract. */
export interface ApiErrorShape {
  message: string;
  /** Field-level messages, keyed by form field name. */
  fieldErrors?: Record<string, string>;
  status?: number;
}

/**
 * What the LaunchPad backend returns for every endpoint. Success payloads are
 * nested under `data`; failures carry a code and, for validation and conflict
 * errors, a per-field breakdown under `error.details`.
 */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

/** One entry of `error.details` — the backend's per-field error shape. */
export interface ApiFieldDetail {
  field: string;
  message: string;
}
