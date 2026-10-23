import type { Programme, ProgrammeGroup, ProgrammeId } from '../types';

/**
 * The catalogue a visitor can join the waitlist for. These are exactly the
 * programmes named elsewhere on the page — nothing is offered here that the
 * page has not already described.
 */
export const PROGRAMMES: readonly Programme[] = [
  {
    id: 'lift-project',
    name: 'The Lift Project',
    audience: 'Evidence-based wellbeing, all settings',
    group: 'Wellbeing',
    availability: 'open',
  },
  {
    id: 'thrive-forward',
    name: 'Thrive Forward Skills & Wellness Navigator',
    audience: 'Refugees and asylum seekers with permission to work, Newham',
    group: 'Wellbeing',
    availability: 'open',
  },
  {
    id: 'stem-sports',
    name: 'STEM Sports',
    audience: 'Year 1–9 plus special education, NEET, adult returners',
    group: 'STEM',
    availability: 'open',
  },
  {
    id: 'launchpad-adult',
    name: 'Adult pathway',
    audience: 'Return-to-work, optional ESOL / RQF Level 6+',
    group: 'LaunchPad101',
    availability: 'coming-soon',
  },
  {
    id: 'launchpad-thrive101',
    name: 'Thrive101',
    audience: 'NEET, ages 16–24',
    group: 'LaunchPad101',
    availability: 'coming-soon',
  },
  {
    id: 'launchpad-school',
    name: 'School edition',
    audience: 'Ages 11–16',
    group: 'LaunchPad101',
    availability: 'coming-soon',
  },
  {
    id: 'launchpad-veterans',
    name: 'Veterans & spouses',
    audience: 'Transition support',
    group: 'LaunchPad101',
    availability: 'coming-soon',
  },
  {
    id: 'launchpad-rise-plus',
    name: 'RISE+',
    audience: 'Ages 9–17, resilience and hopeful futures',
    group: 'LaunchPad101',
    availability: 'coming-soon',
  },
  {
    id: 'launchpad-digital-work-ready',
    name: 'Digital Work Ready',
    audience: 'Refugees and people seeking asylum preparing for work in the UK',
    group: 'LaunchPad101',
    availability: 'coming-soon',
  },
  {
    id: 'resources-guidebooks',
    name: 'Resources & Guidebooks',
    audience: 'Partners, referrers and participants',
    group: 'Resources',
    availability: 'coming-soon',
  },
  {
    id: 'thrive-forward-guidebook',
    name: 'Refugee Skills & Wellness Navigator',
    audience: 'A gentle guide for rebuilding confidence, skills, and wellbeing in Newham',
    group: 'Thrive Forward',
    availability: 'open',
  },
] as const;

export const PROGRAMME_GROUP_ORDER: readonly ProgrammeGroup[] = [
  'Wellbeing',
  'STEM',
  'LaunchPad101',
  'Resources',
  'Thrive Forward',
];

const BY_ID = new Map<ProgrammeId, Programme>(PROGRAMMES.map((p) => [p.id, p]));

export const getProgramme = (id: ProgrammeId): Programme | undefined => BY_ID.get(id);

export const getProgrammeName = (id: ProgrammeId): string => BY_ID.get(id)?.name ?? id;

export const groupProgrammes = (): ReadonlyArray<{
  group: ProgrammeGroup;
  items: readonly Programme[];
}> =>
  PROGRAMME_GROUP_ORDER.map((group) => ({
    group,
    items: PROGRAMMES.filter((programme) => programme.group === group),
  })).filter((entry) => entry.items.length > 0);
