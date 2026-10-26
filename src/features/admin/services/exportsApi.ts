import { apiClient } from '@/lib/apiClient';
import type { ApiErrorShape } from '@/types';

export type Dataset = 'waitlist' | 'street-works';

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false';

const friendly = (status: number | undefined): string =>
  status === 401
    ? 'That password is not right.'
    : status === 429
      ? 'Too many wrong passwords. Wait 15 minutes and try again.'
      : status === 404
        ? 'Downloads are not switched on for this site yet.'
        : 'Something went wrong. Please try again.';

/** Checks the password with the server before showing the download screen. */
export const verifyPassword = async (password: string): Promise<void> => {
  if (USE_MOCK) {
    throw { message: 'Downloads need the live backend. This build uses demo data.' } satisfies ApiErrorShape;
  }
  try {
    await apiClient.post('/exports/verify', { password });
  } catch (error) {
    const shape = error as ApiErrorShape;
    throw { message: friendly(shape.status), status: shape.status } satisfies ApiErrorShape;
  }
};

/**
 * Fetches one export as a file and hands it to the browser to save.
 *
 * The password goes in the request body, never the URL, so it can't end up
 * in browser history, server access logs or a shared link. Nothing about it
 * is stored: the page forgets it as soon as it closes.
 */
export const downloadExport = async (dataset: Dataset, password: string): Promise<void> => {
  if (USE_MOCK) {
    throw { message: 'Downloads need the live backend. This build uses demo data.' } satisfies ApiErrorShape;
  }

  let response;
  try {
    response = await apiClient.post<Blob>(`/exports/${dataset}`, { password }, { responseType: 'blob' });
  } catch (error) {
    // With responseType "blob", the JSON error body arrives as a Blob too.
    const shape = error as ApiErrorShape;
    throw {
      message: shape.status === 401 ? 'Your session has expired. Sign in again.' : friendly(shape.status),
      status: shape.status,
    } satisfies ApiErrorShape;
  }

  const disposition = String(response.headers['content-disposition'] ?? '');
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? `igms-${dataset}.csv`;

  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
