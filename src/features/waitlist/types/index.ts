export type ProgrammeId =
  | 'lift-project'
  | 'stem-sports'
  | 'launchpad-adult'
  | 'launchpad-thrive101'
  | 'launchpad-school'
  | 'launchpad-veterans'
  | 'launchpad-rise-plus'
  | 'resources-guidebooks';

export type ProgrammeGroup = 'Wellbeing' | 'STEM' | 'LaunchPad101' | 'Resources';

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

export interface WaitlistFormValues {
  fullName: string;
  email: string;
  phone: string;
  role: ApplicantRole;
  programmes: ProgrammeId[];
  accessNeeds: string;
  consent: boolean;
}

/** What the service accepts — normalised, with the empty optionals dropped. */
export interface WaitlistSubmission {
  fullName: string;
  email: string;
  phone?: string;
  role: ApplicantRole;
  programmes: ProgrammeId[];
  accessNeeds?: string;
  consent: true;
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
