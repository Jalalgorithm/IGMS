import { create } from 'zustand';
import type { ProgrammeId } from '@/features/waitlist/types';

interface WaitlistUiState {
  /** Programmes pre-ticked when the visitor arrives from a specific section. */
  preselected: ProgrammeId[];
  /** Set when a "Join the waitlist" button elsewhere on the page is used. */
  requestedFocusAt: number | null;
  preselectProgrammes: (ids: ProgrammeId[]) => void;
  requestFocus: (ids?: ProgrammeId[]) => void;
  clearFocusRequest: () => void;
}

/**
 * Client-only state that lets any section on the page hand the waitlist form a
 * starting selection. The submission itself lives in TanStack Query.
 */
export const useWaitlistUiStore = create<WaitlistUiState>((set) => ({
  preselected: [],
  requestedFocusAt: null,
  preselectProgrammes: (preselected) => set({ preselected }),
  requestFocus: (ids) =>
    set((state) => ({
      preselected: ids ?? state.preselected,
      requestedFocusAt: Date.now(),
    })),
  clearFocusRequest: () => set({ requestedFocusAt: null }),
}));
