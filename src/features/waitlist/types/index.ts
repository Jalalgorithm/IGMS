export type ProgrammeId =
  | 'thrive-forward'
  | 'thrive-forward-guidebook'
  | 'lift-project'
  | 'stem-sports'
  | 'launchpad-adult'
  | 'launchpad-thrive101'
  | 'launchpad-school'
  | 'launchpad-veterans'
  | 'launchpad-rise-plus'
  | 'launchpad-digital-work-ready'
  | 'resources-guidebooks';

export type ProgrammeGroup =
  | 'Wellbeing'
  | 'STEM'
  | 'LaunchPad101'
  | 'Resources'
  | 'Thrive Forward';

export type ProgrammeAvailability = 'open' | 'coming-soon';

export interface Programme {
  readonly id: ProgrammeId;
  readonly name: string;
  /** Who it is for — shown under the name so the choice is informed. */
  readonly audience: string;
  readonly group: ProgrammeGroup;
  readonly availability: ProgrammeAvailability;
}

/** How the person joining relates to the programme. */
export type ApplicantRole =
  | 'participant'
  | 'parent-or-carer'
  | 'referrer'
  | 'partner-organisation'
  | 'other';

/** Channels a visitor has agreed IGMS may use to contact them. */
export type ContactChannel = 'email' | 'phone' | 'post';

/** How a visitor who gives a number wants it used. */
export type PhoneMethod = 'call' | 'whatsapp';

import type { CountryCode } from 'libphonenumber-js/min';

export interface WaitlistFormValues {
  fullName: string;
  email: string;
  phone: string;
  phoneCountry: CountryCode;
  phoneMethods: PhoneMethod[];
  role: ApplicantRole;
  programmes: ProgrammeId[];
  accessNeeds: string;
  contactChannels: ContactChannel[];
}

/** What the service accepts — normalised, with the empty optionals dropped. */
export interface WaitlistSubmission {
  fullName: string;
  email: string;
  /** E.164, e.g. +447700900123. */
  phone?: string;
  /** Present only alongside `phone`. */
  phoneMethods?: PhoneMethod[];
  role: ApplicantRole;
  programmes: ProgrammeId[];
  accessNeeds?: string;
  /** Kept for backend compatibility — always true once channels are chosen. */
  consent: true;
  /** At least one channel — this is the consent record for contact. */
  contactChannels: ContactChannel[];
}

export interface WaitlistEntry {
  readonly id: string;
  /** Human-quotable reference shown on the confirmation. */
  readonly reference: string;
  readonly email: string;
  readonly fullName: string;
  readonly programmes: ProgrammeId[];
  readonly submittedAt: string;
}
