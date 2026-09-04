import type { ContextCopy, EasyAskContext, TransportCopy, TransportMode } from '../types';

/**
 * The wording for each context, kept here rather than in the components so the
 * questions can be reviewed as a set. Every question is phrased to invite a
 * description, never a justification — nobody using this should feel they are
 * being asked to prove anything.
 */
export const CONTEXTS: readonly ContextCopy[] = [
  {
    id: 'work',
    label: 'Work',
    questionOne: 'What is making things hard right now?',
    hintOne: 'For example: concentrating, noise, the hours, getting around the building.',
    questionTwo: 'What would help?',
    hintTwo: 'For example: a quieter space, different hours, equipment.',
    intro: 'There are no wrong answers. Say as much or as little as you like.',
  },
  {
    id: 'doctor',
    label: 'Doctor',
    questionOne: 'What have you been noticing?',
    hintOne: 'For example: what you have felt, how long for, how it affects your day.',
    questionTwo: 'What would you like from the appointment?',
    hintTwo: 'For example: to understand what is happening, a referral, a change to treatment.',
    intro: 'Take your time. This is to help you feel prepared, not to diagnose anything.',
  },
  {
    id: 'school',
    label: 'School',
    questionOne: 'What is your child finding hard?',
    hintOne: 'For example: noise, changes to routine, written work, break times.',
    questionTwo: 'What adjustment would help most?',
    hintTwo: 'For example: a quieter space, extra time, a warning before changes.',
    intro: 'Start with what works well if you can — it helps the school see the whole picture.',
  },
  {
    id: 'transport',
    label: 'Transport',
    questionOne: 'What is making the journey hard?',
    hintOne: 'For example: boarding, steps, distance to the stop, somewhere to sit.',
    questionTwo: 'What assistance would help?',
    hintTwo: 'For example: help boarding, a closer pickup point, someone to meet you.',
    intro: 'There are no wrong answers. Say as much or as little as you like.',
  },
];

export const TRANSPORT_MODES: readonly TransportCopy[] = [
  {
    id: 'land',
    label: 'Bus, train or tram',
    questionOne: 'What is making the journey hard?',
    hintOne: 'For example: boarding, steps, distance to the stop, somewhere to sit.',
  },
  {
    id: 'sea',
    label: 'Ferry or boat',
    questionOne: 'What is making the journey hard?',
    hintOne: 'For example: boarding, moving around on board, somewhere to sit.',
  },
  {
    id: 'air',
    label: 'Flight',
    questionOne: 'What is making the journey hard?',
    hintOne: 'For example: boarding, moving down the aisle, transferring from a wheelchair.',
  },
];

const CONTEXT_BY_ID = new Map<EasyAskContext, ContextCopy>(CONTEXTS.map((c) => [c.id, c]));
const MODE_BY_ID = new Map<TransportMode, TransportCopy>(TRANSPORT_MODES.map((m) => [m.id, m]));

export const getContextCopy = (id: EasyAskContext): ContextCopy => {
  const copy = CONTEXT_BY_ID.get(id);
  if (!copy) throw new Error(`Unknown EasyAsk context: ${id}`);
  return copy;
};

export const getTransportCopy = (id: TransportMode): TransportCopy => {
  const copy = MODE_BY_ID.get(id);
  if (!copy) throw new Error(`Unknown transport mode: ${id}`);
  return copy;
};

/** Question one changes with the mode; question two never does. */
export const questionsFor = (
  context: EasyAskContext,
  mode: TransportMode | null,
): { one: string; hintOne: string; two: string; hintTwo: string; intro: string } => {
  const base = getContextCopy(context);
  if (context === 'transport' && mode) {
    const modeCopy = getTransportCopy(mode);
    return {
      one: modeCopy.questionOne,
      hintOne: modeCopy.hintOne,
      two: base.questionTwo,
      hintTwo: base.hintTwo,
      intro: base.intro,
    };
  }
  return {
    one: base.questionOne,
    hintOne: base.hintOne,
    two: base.questionTwo,
    hintTwo: base.hintTwo,
    intro: base.intro,
  };
};

export const ANSWER_MAX_LENGTH = 180;
