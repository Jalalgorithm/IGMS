import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/utils/classNames';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Announced as the dialog's accessible name. */
  title: string;
  /** Hides the visual heading while keeping the accessible name. */
  hideTitle?: boolean;
  children: ReactNode;
  /** Rendered in the header bar, to the left of the close button. */
  headerLeft?: ReactNode;
  /** Pinned below the scroll area — progress indicators, persistent actions. */
  footer?: ReactNode;
  className?: string;
}

/**
 * Portalled dialog with a focus trap, Escape to close, and a locked body.
 *
 * Rendered into `document.body` rather than in place: the landing sections use
 * transforms for the scroll reveals, and a transformed ancestor makes
 * `position: fixed` resolve against that ancestor instead of the viewport —
 * which would leave the dialog anchored to whatever section it was declared in.
 */
export const Modal = ({
  open,
  onClose,
  title,
  hideTitle = false,
  children,
  headerLeft,
  footer,
  className,
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = 'modal-title';

  const handleEscape = useCallback(() => onClose(), [onClose]);
  useFocusTrap(panelRef, open, handleEscape);

  // The page behind must not scroll under the dialog. The scrollbar's width is
  // replaced as padding so the layout does not jump sideways on open.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      {/* Presentational: Escape and the close button are the real affordances,
          and the trap keeps keyboard focus off this element entirely. */}
      <div
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[var(--radius-card)] bg-ivory shadow-float sm:max-w-lg sm:rounded-[var(--radius-card)]',
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-sand px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {headerLeft}
            <h2
              id={titleId}
              className={cn(
                'm-0 truncate font-display text-lg font-semibold text-terracotta',
                hideTitle && 'sr-only',
              )}
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-charcoal/20 text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer}
      </div>
    </div>,
    document.body,
  );
};
