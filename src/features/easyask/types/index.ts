export type EasyAskContext = 'work' | 'doctor' | 'school' | 'transport';
export type TransportMode = 'land' | 'sea' | 'air';

/** The four steps of the flow, in order. */
export type EasyAskStep = 'context' | 'questions' | 'confirm' | 'note';

export interface ContextCopy {
  readonly id: EasyAskContext;
  readonly label: string;
  /** Question one, phrased for this context. */
  readonly questionOne: string;
  readonly hintOne: string;
  readonly questionTwo: string;
  readonly hintTwo: string;
  /** Sets expectations at the top of the questions step. */
  readonly intro: string;
}

export interface TransportCopy {
  readonly id: TransportMode;
  readonly label: string;
  readonly questionOne: string;
  readonly hintOne: string;
}

export interface ShortNoteRequest {
  context: EasyAskContext;
  transportMode?: TransportMode;
  difficulty: string;
  help: string;
}

export interface ShortNote {
  readonly title: string;
  readonly lines: string[];
  /**
   * The answers described risk of harm rather than an access need. The note is
   * still returned; this only tells the UI to show support signposting.
   */
  readonly concern: boolean;
}
