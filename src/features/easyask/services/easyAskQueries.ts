import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { ApiErrorShape } from '@/types';
import type { ShortNote, ShortNoteRequest } from '../types';
import { generateShortNote } from './easyAskApi';

/**
 * Not cached, and deliberately so: the answers are never stored anywhere, and
 * a query cache is storage. A mutation runs, returns, and keeps only what the
 * component holds — which is cleared when the dialog closes.
 */
export const useShortNoteMutation = (): UseMutationResult<
  ShortNote,
  ApiErrorShape,
  ShortNoteRequest
> =>
  useMutation<ShortNote, ApiErrorShape, ShortNoteRequest>({
    mutationFn: generateShortNote,
    retry: false,
    gcTime: 0,
  });
