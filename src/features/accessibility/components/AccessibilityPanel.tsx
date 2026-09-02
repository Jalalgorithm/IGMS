import { useRef } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Toggle } from '@/components/ui/Toggle';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useAccessibilityStore, type TextSize } from '@/stores/accessibilityStore';
import { useReadAloud } from '../hooks/useReadAloud';

const TEXT_SIZES: ReadonlyArray<{ value: TextSize; label: string }> = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
  { value: 'x-large', label: 'X-Large' },
];

interface AccessibilityPanelProps {
  titleId: string;
  onClose: () => void;
}

export const AccessibilityPanel = ({ titleId, onClose }: AccessibilityPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const textSize = useAccessibilityStore((state) => state.textSize);
  const highContrast = useAccessibilityStore((state) => state.highContrast);
  const reduceMotion = useAccessibilityStore((state) => state.reduceMotion);
  const setTextSize = useAccessibilityStore((state) => state.setTextSize);
  const toggleHighContrast = useAccessibilityStore((state) => state.toggleHighContrast);
  const toggleReduceMotion = useAccessibilityStore((state) => state.toggleReduceMotion);

  const readAloud = useReadAloud();

  useFocusTrap(panelRef, true, onClose);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      data-read-aloud="skip"
      className="w-[19rem] rounded-2xl border border-sand bg-white p-5 shadow-[0_16px_40px_rgb(35_31_27/0.24)]"
    >
      <h2 id={titleId} className="m-0 mb-4 font-display text-lg font-semibold text-charcoal">
        Accessibility
      </h2>

      <div className="flex flex-col gap-4">
        <SegmentedControl
          legend="Text size"
          value={textSize}
          options={TEXT_SIZES}
          onChange={setTextSize}
        />

        <div className="flex flex-col divide-y divide-sand/60">
          <Toggle
            label="High contrast"
            checked={highContrast}
            onChange={toggleHighContrast}
            description="Stronger colours, no photo grading"
          />
          <Toggle
            label="Reduce motion"
            checked={reduceMotion}
            onChange={toggleReduceMotion}
            description="Turns off reveals and smooth scrolling"
          />
        </div>

        <button
          type="button"
          onClick={readAloud.toggle}
          disabled={readAloud.status === 'unsupported'}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-charcoal px-4 py-3 font-sans text-sm font-semibold text-charcoal transition-colors duration-150 hover:bg-charcoal hover:text-ivory disabled:cursor-not-allowed disabled:border-sand disabled:text-warm-grey disabled:hover:bg-transparent disabled:hover:text-warm-grey"
        >
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" aria-hidden="true">
            <path
              d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {readAloud.status === 'speaking'
            ? 'Stop reading'
            : readAloud.status === 'unsupported'
              ? 'Read aloud unavailable'
              : 'Read this screen aloud'}
        </button>

        {readAloud.status === 'unsupported' ? (
          <p className="m-0 font-sans text-xs leading-relaxed text-warm-grey">
            Your browser does not offer speech synthesis. Your device or screen reader may
            still be able to read this page.
          </p>
        ) : null}
      </div>
    </div>
  );
};
