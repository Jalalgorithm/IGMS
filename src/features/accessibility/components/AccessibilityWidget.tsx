import { useCallback, useId, useRef } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { cn } from '@/utils/classNames';
import { AccessibilityIcon } from './AccessibilityIcon';
import { AccessibilityPanel } from './AccessibilityPanel';

/**
 * Floating reader controls, pinned bottom-right on every screen. Deliberately
 * outside `#main` so "read this screen aloud" never reads its own controls.
 */
export const AccessibilityWidget = () => {
  const isOpen = useAccessibilityStore((state) => state.isPanelOpen);
  const togglePanel = useAccessibilityStore((state) => state.togglePanel);
  const closePanel = useAccessibilityStore((state) => state.closePanel);

  const titleId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const refs = useRef([wrapperRef]).current;

  const handleOutside = useCallback(() => closePanel(), [closePanel]);
  useOnClickOutside(refs, handleOutside, isOpen);

  return (
    <div
      ref={wrapperRef}
      data-read-aloud="skip"
      className="fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-3 print:hidden sm:bottom-5 sm:right-5"
    >
      {isOpen ? <AccessibilityPanel titleId={titleId} onClose={closePanel} /> : null}

      <button
        type="button"
        onClick={togglePanel}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close accessibility options' : 'Open accessibility options'}
        className={cn(
          'flex size-12 items-center justify-center rounded-full border-2 shadow-[0_8px_24px_rgb(35_31_27/0.28)] transition-colors duration-200',
          isOpen
            ? 'border-charcoal bg-charcoal text-ivory'
            : 'border-charcoal bg-ivory text-charcoal hover:bg-charcoal hover:text-ivory',
        )}
      >
        <AccessibilityIcon className="size-6" />
      </button>
    </div>
  );
};
