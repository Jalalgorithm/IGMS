import { useMutation, useQuery, type UseMutationResult } from '@tanstack/react-query';
import type { ApiErrorShape } from '@/types';
import type { Programme, WaitlistEntry, WaitlistSubmission } from '../types';
import { PROGRAMMES } from './programmes';
import { getStoredEntries, submitWaitlistEntry } from './waitlistApi';

export const waitlistKeys = {
  all: ['waitlist'] as const,
  programmes: () => [...waitlistKeys.all, 'programmes'] as const,
  entries: () => [...waitlistKeys.all, 'entries'] as const,
};

/**
 * The catalogue is local today, but it is fetched through Query so that
 * pointing it at an endpoint later is a one-line change in the queryFn.
 */
export const useProgrammes = () =>
  useQuery<readonly Programme[]>({
    queryKey: waitlistKeys.programmes(),
    queryFn: () => Promise.resolve(PROGRAMMES),
    staleTime: Infinity,
  });

export const useWaitlistEntries = () =>
  useQuery<readonly WaitlistEntry[]>({
    queryKey: waitlistKeys.entries(),
    queryFn: () => Promise.resolve(getStoredEntries()),
  });

export const useJoinWaitlist = (): UseMutationResult<
  WaitlistEntry,
  ApiErrorShape,
  WaitlistSubmission
> =>
  useMutation<WaitlistEntry, ApiErrorShape, WaitlistSubmission>({
    mutationKey: [...waitlistKeys.all, 'join'],
    mutationFn: submitWaitlistEntry,
  });
