import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiErrorShape } from '@/types';

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

/** Normalises every failure into one shape so components never parse axios. */
export const toApiError = (error: unknown): ApiErrorShape => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<Partial<ApiErrorShape>>;
    const data = axiosError.response?.data;
    return {
      message:
        data?.message ??
        (axiosError.code === 'ECONNABORTED'
          ? 'That took too long. Check your connection and try again.'
          : 'Something went wrong on our side. Please try again.'),
      fieldErrors: data?.fieldErrors,
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
