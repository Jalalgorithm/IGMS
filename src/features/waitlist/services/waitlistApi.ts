import { apiClient } from '@/lib/apiClient';
import type { ApiErrorShape } from '@/types';
import type { WaitlistEntry, WaitlistSubmission } from '../types';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false';
const STORAGE_KEY = 'igms.waitlist.entries';
const MOCK_LATENCY_MS = 900;

/* ------------------------------------------------------------------ *
 * Mock transport
 *
 * Stands in for POST /waitlist. It persists to localStorage so the
 * behaviour is observable across reloads, rejects duplicates the way a
 * real endpoint would, and rejects with the same ApiErrorShape that
 * `toApiError` produces — so swapping in the real call below changes
 * nothing for the components.
 * ------------------------------------------------------------------ */

const readStored = (): WaitlistEntry[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WaitlistEntry[]) : [];
  } catch {
    return [];
  }
};

const writeStored = (entries: WaitlistEntry[]): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable — the entry still resolves for this session */
  }
};

const makeReference = (): string => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  for (let i = 0; i < 5; i += 1) {
    tail += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return `IGMS-${new Date().getFullYear()}-${tail}`;
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const reject = (error: ApiErrorShape): Promise<never> => Promise.reject(error);

const submitMock = async (submission: WaitlistSubmission): Promise<WaitlistEntry> => {
  await delay(MOCK_LATENCY_MS);

  const email = submission.email.toLowerCase();

  // A deliberate hook for exercising the error path in development.
  if (email.startsWith('fail@')) {
    return reject({
      message: 'We could not save that just now. Please try again in a moment.',
      status: 500,
    });
  }

  const entries = readStored();
  if (entries.some((entry) => entry.email.toLowerCase() === email)) {
    return reject({
      message: 'That email address is already on the waitlist.',
      fieldErrors: { email: 'This address is already registered. Check your inbox for your reference.' },
      status: 409,
    });
  }

  const entry: WaitlistEntry = {
    id: crypto.randomUUID(),
    reference: makeReference(),
    email: submission.email,
    fullName: submission.fullName,
    programmes: submission.programmes,
    submittedAt: new Date().toISOString(),
  };

  writeStored([...entries, entry]);
  return entry;
};

/* ------------------------------------------------------------------ *
 * Public service
 * ------------------------------------------------------------------ */

export const submitWaitlistEntry = async (
  submission: WaitlistSubmission,
): Promise<WaitlistEntry> => {
  if (USE_MOCK) return submitMock(submission);

  const { data } = await apiClient.post<WaitlistEntry>('/waitlist', submission);
  return data;
};

/** Entries saved by the mock, for the "already joined" hint on the form. */
export const getStoredEntries = (): readonly WaitlistEntry[] =>
  USE_MOCK ? readStored() : [];

export const clearStoredEntries = (): void => {
  if (!USE_MOCK) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
};
