/** Mirrors streetWorks.catalogue.ts in the backend. Adding an option means changing both. */
export const AREAS = [
  'Stratford',
  'Forest Gate',
  'Manor Park',
  'East Ham',
  'Upton Park and Green Street',
  'Plaistow',
  'West Ham',
  'Canning Town',
  'Custom House and Royal Docks',
  'Beckton',
  'Other',
] as const;
export type Area = (typeof AREAS)[number];

export const HARM_TICKS = ['fall', 'missed', 'avoided', 'isolated'] as const;
export const PROBLEM_TICKS = ['closed', 'surface', 'crossing', 'barriers', 'nowarning', 'noise'] as const;
export type Tick = (typeof HARM_TICKS)[number] | (typeof PROBLEM_TICKS)[number];

export type ReportedBy = 'self' | 'support' | 'researcher';

/** The wording on the report form, in the order it is asked. */
export const TICK_QUESTIONS: Record<Tick, string> = {
  fall: 'I fell, or nearly fell',
  missed: 'I was late for, or missed, work or an appointment',
  avoided: "I didn't make the trip, or I needed help",
  isolated: 'I go out less because of it',
  closed: 'The pavement was closed or too narrow',
  surface: 'The ground was uneven or bumpy',
  crossing: 'There was no safe way to cross',
  barriers: 'Barriers or signs were in the way',
  nowarning: 'Nobody told me the works were coming',
  noise: 'It was too noisy or crowded',
};

/** Shorter wording for the board and the council brief. */
export const TICK_LABELS: Record<Tick, string> = {
  fall: 'A fall or near miss',
  missed: 'Missed work or an appointment',
  avoided: 'Gave up a trip or needed help',
  isolated: 'Goes out less',
  closed: 'Pavement closed or narrowed',
  surface: 'Uneven surface',
  crossing: 'No safe crossing',
  barriers: 'Barriers or signs in the way',
  nowarning: 'No warning the works were coming',
  noise: 'Noise or crowding',
};

export interface ReportSubmission {
  ticks: Tick[];
  area: Area;
  street?: string;
  by: ReportedBy;
  /** Bot trap — always empty when a person fills the form in. */
  website?: string;
}

export type Period = '30' | 'all';

export interface BoardRow {
  name: string;
  area: string | null;
  reports: number;
  harm: number;
  counts: Record<Tick, number>;
}

export interface Board {
  period: Period;
  totals: { reports: number; falls: number; missed: number; cutOff: number };
  streets: BoardRow[];
  areas: BoardRow[];
  ticks: BoardRow[];
}
