export type ReadAloudStatus = 'idle' | 'speaking' | 'unsupported';

export interface ReadAloudControls {
  status: ReadAloudStatus;
  /** Reads the visible text of `#main`, or the whole document as a fallback. */
  speak: () => void;
  stop: () => void;
  toggle: () => void;
}
