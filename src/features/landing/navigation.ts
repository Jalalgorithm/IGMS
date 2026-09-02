import type { NavItem } from './types';

/** Shared by the header and the footer so the two can never drift apart. */
export const NAV_ITEMS: readonly NavItem[] = [
  { targetId: 'about', label: 'About' },
  { targetId: 'focus-areas', label: 'Focus Areas' },
  { targetId: 'lift-project', label: 'The Lift Project' },
  { targetId: 'stem-sports', label: 'STEM Sports' },
  { targetId: 'launchpad', label: 'LaunchPad101' },
  { targetId: 'waitlist', label: 'Waitlist' },
];

/**
 * Donate lives in the header only — never repeated in the footer or between
 * sections. Swap the placeholder for the live Stripe payment link.
 */
export const DONATE_URL =
  import.meta.env.VITE_DONATE_URL ?? 'https://buy.stripe.com/REPLACE_WITH_STRIPE_LINK';

/**
 * The two programmes IGMS is the UK delivery partner for. Canonical forms —
 * theliftproject.global redirects to www, so the www form is used directly.
 * Single source of truth: these appear in the hero card and in each
 * programme's own section.
 */
export const PARTNER_LINKS = {
  liftProject: 'https://www.theliftproject.global/',
  stemSports: 'https://stemsports.com/',
} as const;

export const ORG = {
  legalName: 'Integrated Global Menospace Solutions CIC',
  shortName: 'IGMS',
  registeredNumber: '16227437',
  address: 'Office 11436, 182–184 High Street North, East Ham, London E6 2JA, United Kingdom',
} as const;
