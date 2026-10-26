import { apiClient } from '@/lib/apiClient';
import type { ApiEnvelope } from '@/types';
import type { Board, BoardRow, Period, ReportSubmission, Tick } from '../types';

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false';

/* ------------------------------------------------------------------ *
 * Demo data, for local and staging builds only. Nothing typed into the
 * form is kept — not even in the browser — and the board says plainly
 * that what it shows is an example.
 * ------------------------------------------------------------------ */

const counts = (ticks: Partial<Record<Tick, number>>): Record<Tick, number> => ({
  fall: 0, missed: 0, avoided: 0, isolated: 0,
  closed: 0, surface: 0, crossing: 0, barriers: 0, nowarning: 0, noise: 0,
  ...ticks,
});

const row = (name: string, area: string | null, reports: number, harm: number, c: Partial<Record<Tick, number>>): BoardRow => ({
  name, area, reports, harm, counts: counts(c),
});

const DEMO_BOARD: Omit<Board, 'period'> = {
  totals: { reports: 11, falls: 2, missed: 3, cutOff: 4 },
  streets: [
    row('Romford Road', 'Forest Gate', 3, 17, { closed: 2, fall: 1, crossing: 1, missed: 1, isolated: 1, nowarning: 1 }),
    row('Green Street', 'Upton Park and Green Street', 3, 13, { barriers: 1, isolated: 1, surface: 1, fall: 1, nowarning: 1 }),
    row('Other streets in East Ham', null, 2, 7, { closed: 1, missed: 1, surface: 1, nowarning: 1 }),
    row('Other streets in Stratford', null, 1, 9, { crossing: 1, missed: 1, avoided: 1 }),
  ],
  areas: [
    row('Forest Gate', null, 4, 19, { closed: 2, fall: 1, crossing: 1, missed: 1, isolated: 1, nowarning: 2, barriers: 1 }),
    row('Upton Park and Green Street', null, 2, 13, { barriers: 1, isolated: 1, surface: 1, fall: 1, nowarning: 1 }),
    row('Stratford', null, 1, 9, { crossing: 1, missed: 1, avoided: 1 }),
  ],
  ticks: [
    row('nowarning', null, 4, 18, { nowarning: 4 }),
    row('closed', null, 4, 20, { closed: 4 }),
    row('missed', null, 3, 16, { missed: 3 }),
    row('fall', null, 2, 14, { fall: 2 }),
  ],
};

const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */

export const submitReport = async (report: ReportSubmission): Promise<void> => {
  if (USE_MOCK) {
    await delay(700);
    return;
  }
  await apiClient.post('/street-works/reports', report);
};

export const fetchBoard = async (period: Period): Promise<Board> => {
  if (USE_MOCK) {
    await delay(300);
    return { period, ...DEMO_BOARD };
  }
  const { data } = await apiClient.get<ApiEnvelope<Board>>('/street-works/board', { params: { period } });
  return data.data;
};
