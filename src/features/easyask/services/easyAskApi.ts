import { apiClient } from '@/lib/apiClient';
import type { ApiEnvelope } from '@/types';
import type { ShortNote, ShortNoteRequest } from '../types';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false';
const MOCK_LATENCY_MS = 1100;

const TITLES: Record<ShortNoteRequest['context'], string> = {
  work: 'Your Short Note — for Work',
  doctor: 'Your Short Note — for your Doctor',
  school: 'Your Short Note — for School',
  transport: 'Your Short Note — for your Journey',
};

/**
 * Stand-in for POST /easyask/short-note.
 *
 * The real note is written by an AI model; this templates the two answers into
 * the same three-sentence shape so the flow is testable without a backend or
 * an API key. It is deliberately not clever — nobody should mistake it for the
 * real output.
 */
const mockShortNote = async (request: ShortNoteRequest): Promise<ShortNote> => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_LATENCY_MS);
  });

  const { difficulty, help, context } = request;
  const lines =
    context === 'doctor'
      ? [
          `I have been noticing ${difficulty}.`,
          `From this appointment, I would like ${help}.`,
          'I would like to work together on what happens next.',
        ]
      : context === 'school'
        ? [
            `My child is finding it hard because ${difficulty}.`,
            `An adjustment that would help is ${help}.`,
            'I would welcome a chance to discuss this together.',
          ]
        : context === 'transport'
          ? [
              `For this journey, the difficulty is ${difficulty}.`,
              `The assistance that would help is ${help}.`,
              'Please let me know how to arrange that assistance.',
            ]
          : [
              `I am finding it hard because ${difficulty}.`,
              `It would help if ${help}.`,
              'I would like to talk about this when you have a moment.',
            ];

  return { title: TITLES[context], lines, concern: false };
};

export const generateShortNote = async (request: ShortNoteRequest): Promise<ShortNote> => {
  if (USE_MOCK) return mockShortNote(request);

  const { data: envelope } = await apiClient.post<ApiEnvelope<ShortNote>>(
    '/easyask/short-note',
    request,
  );
  return envelope.data;
};
