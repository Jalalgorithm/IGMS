import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiErrorShape, ApiFieldDetail } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

/**
 * Shared axios instance.
 *
 * `withCredentials` is on so that when a real backend arrives it can set an
 * HTTP-only session cookie and this client will carry it without any token
 * handling in the app. Nothing on the public site needs a session today.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  config.headers.set('X-Requested-With', 'XMLHttpRequest');
  return config;
});

/** The backend reports per-field problems as a list; forms want them keyed. */
const toFieldErrors = (
  details: unknown,
  fallback: Record<string, string> | undefined,
): Record<string, string> | undefined => {
  if (!Array.isArray(details)) return fallback;
  const entries = (details as ApiFieldDetail[]).filter(
    (detail) => typeof detail?.field === 'string' && typeof detail?.message === 'string',
  );
  if (entries.length === 0) return fallback;
  return Object.fromEntries(entries.map((detail) => [detail.field, detail.message]));
};

/** Normalises every failure into one shape so components never parse axios. */
export const toApiError = (error: unknown): ApiErrorShape => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<
      Partial<ApiErrorShape> & { error?: { details?: unknown } }
    >;
    const data = axiosError.response?.data;
    return {
      message:
        data?.message ??
        (axiosError.code === 'ECONNABORTED'
          ? 'That took too long. Check your connection and try again.'
          : 'Something went wrong on our side. Please try again.'),
      // `fieldErrors` is the mock's shape; `error.details` is the real
      // backend's. Both land here so swapping transports changes nothing.
      fieldErrors: toFieldErrors(data?.error?.details, data?.fieldErrors),
      status: axiosError.response?.status,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Something went wrong. Please try again.' };
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);
