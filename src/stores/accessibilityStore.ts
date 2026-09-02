import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TextSize = 'normal' | 'large' | 'x-large';

export interface AccessibilityState {
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  isPanelOpen: boolean;
  setTextSize: (size: TextSize) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  reset: () => void;
}

const DEFAULTS = {
  textSize: 'normal' as TextSize,
  highContrast: false,
  reduceMotion: false,
};

/**
 * Reader preferences. Persisted so a visitor who needs larger text or higher
 * contrast sets it once, not on every visit. `isPanelOpen` is deliberately
 * excluded from persistence — it is transient UI state.
 */
export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      isPanelOpen: false,
      setTextSize: (textSize) => set({ textSize }),
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
      toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
      openPanel: () => set({ isPanelOpen: true }),
      closePanel: () => set({ isPanelOpen: false }),
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: 'igms.accessibility',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        textSize: state.textSize,
        highContrast: state.highContrast,
        reduceMotion: state.reduceMotion,
      }),
    },
  ),
);
