import { useCallback, useState } from 'react';
import type { ApiErrorShape } from '@/types';
import { useShortNoteMutation } from '../services/easyAskQueries';
import type { EasyAskContext, EasyAskStep, ShortNote, TransportMode } from '../types';

interface EasyAskFlow {
  step: EasyAskStep;
  context: EasyAskContext | null;
  transportMode: TransportMode | null;
  difficulty: string;
  help: string;
  note: ShortNote | undefined;
  error: ApiErrorShape | null;
  isGenerating: boolean;
  /** True once a context — and, for transport, a mode — has been chosen. */
  canStart: boolean;
  canConfirm: boolean;

  selectContext: (context: EasyAskContext) => void;
  selectTransportMode: (mode: TransportMode) => void;
  setDifficulty: (value: string) => void;
  setHelp: (value: string) => void;
  goToStep: (step: EasyAskStep) => void;
  generate: () => void;
  reset: () => void;
}

const MIN_ANSWER_LENGTH = 3;

/**
 * Holds the whole EasyAsk flow in component state.
 *
 * Nothing here is persisted — no localStorage, no query cache, no store. The
 * tool tells people nothing they type is saved, and the only way to keep that
 * true on the client is for the answers to die with the dialog.
 */
export const useEasyAskFlow = (): EasyAskFlow => {
  const [step, setStep] = useState<EasyAskStep>('context');
  const [context, setContext] = useState<EasyAskContext | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode | null>(null);
  const [difficulty, setDifficulty] = useState('');
  const [help, setHelp] = useState('');

  const mutation = useShortNoteMutation();

  const selectContext = useCallback((next: EasyAskContext) => {
    setContext(next);
    // Leaving transport makes the mode meaningless; keeping it would let a
    // stale value ride along in the request.
    if (next !== 'transport') setTransportMode(null);
  }, []);

  const selectTransportMode = useCallback((mode: TransportMode) => {
    setTransportMode(mode);
  }, []);

  const goToStep = useCallback((next: EasyAskStep) => {
    setStep(next);
  }, []);

  const generate = useCallback(() => {
    if (!context) return;
    mutation.mutate(
      {
        context,
        ...(context === 'transport' && transportMode ? { transportMode } : {}),
        difficulty: difficulty.trim(),
        help: help.trim(),
      },
      { onSuccess: () => setStep('note') },
    );
  }, [context, transportMode, difficulty, help, mutation]);

  const reset = useCallback(() => {
    setStep('context');
    setContext(null);
    setTransportMode(null);
    setDifficulty('');
    setHelp('');
    mutation.reset();
  }, [mutation]);

  const canStart = Boolean(context) && (context !== 'transport' || Boolean(transportMode));
  const canConfirm =
    difficulty.trim().length >= MIN_ANSWER_LENGTH && help.trim().length >= MIN_ANSWER_LENGTH;

  return {
    step,
    context,
    transportMode,
    difficulty,
    help,
    note: mutation.data,
    error: mutation.error ?? null,
    isGenerating: mutation.isPending,
    canStart,
    canConfirm,
    selectContext,
    selectTransportMode,
    setDifficulty,
    setHelp,
    goToStep,
    generate,
    reset,
  };
};
