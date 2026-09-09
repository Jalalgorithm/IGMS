import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { cn } from '@/utils/classNames';

export interface NavDropdownItem {
  readonly targetId: string;
  readonly label: string;
}

interface NavDropdownProps {
  id: string;
  label: string;
  items: readonly NavDropdownItem[];
  /** Where the trigger's own label points, when the group has a section. */
  targetId?: string;
  onNavigate: (targetId: string) => void;
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="m6 9 6 6 6-6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * A disclosure menu for the header.
 *
 * Built as a button plus a list rather than the ARIA menu pattern: these are
 * navigation links, not commands, and `role="menu"` would make a screen
 * reader announce them as an application menu and swallow its own reading
 * shortcuts. Keyboard support is what people actually expect from a nav —
 * Enter/Space to open, arrows to move through, Escape to close, Tab to leave.
 *
 * Opening on hover alone is deliberately avoided: it strands anyone using
 * touch, and makes the menu flicker for anyone with an unsteady pointer.
 * Hover opens it as a convenience, but a click is always what commits.
 */
export const NavDropdown = ({ id, label, items, targetId, onNavigate }: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const closeTimer = useRef<number | undefined>(undefined);

  const refs = useRef([wrapperRef]).current;
  const close = useCallback(() => setIsOpen(false), []);
  useOnClickOutside(refs, close, isOpen);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const focusItem = useCallback((index: number) => {
    const clamped = (index + items.length) % items.length;
    itemRefs.current[clamped]?.focus();
  }, [items.length]);

  const openAndFocus = useCallback(
    (index: number) => {
      setIsOpen(true);
      // The list is not in the DOM until after this render commits.
      window.requestAnimationFrame(() => focusItem(index));
    },
    [focusItem],
  );

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openAndFocus(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAndFocus(items.length - 1);
    } else if (event.key === 'Escape') {
      close();
    }
  };

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>, index: number): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItem(index - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
      triggerRef.current?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusItem(items.length - 1);
    }
  };

  const handleTriggerClick = (): void => {
    // A group with a section of its own scrolls there and closes; one that is
    // only a container just toggles.
    if (targetId && isOpen) {
      onNavigate(targetId);
      close();
      return;
    }
    setIsOpen((open) => !open);
  };

  const openOnHover = (): void => {
    window.clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const closeOnLeave = (): void => {
    // A short grace period so the pointer can cross the gap between the
    // trigger and the panel without the menu vanishing underneath it.
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(close, 160);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openOnHover}
      onMouseLeave={closeOnLeave}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center gap-1.5 font-sans text-sm font-medium text-charcoal transition-colors duration-150 hover:text-terracotta"
      >
        {label}
        <Chevron open={isOpen} />
      </button>

      <div
        id={`${id}-menu`}
        aria-labelledby={`${id}-trigger`}
        hidden={!isOpen}
        className="absolute left-1/2 top-full z-10 w-56 -translate-x-1/2 pt-3"
      >
        <ul className="m-0 list-none rounded-[var(--radius-tile)] border border-charcoal/10 bg-ivory p-2 shadow-float">
          {targetId ? (
            <li>
              <a
                href={`#${targetId}`}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(targetId);
                  close();
                }}
                className="block rounded-lg px-3 py-2 font-sans text-sm font-semibold text-terracotta no-underline hover:bg-marigold/20"
              >
                All {label.toLowerCase()}
              </a>
            </li>
          ) : null}

          {items.map((item, index) => (
            <li key={item.targetId}>
              <a
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                href={`#${item.targetId}`}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.targetId);
                  close();
                }}
                onKeyDown={(event) => handleItemKeyDown(event, index)}
                className="block rounded-lg px-3 py-2 font-sans text-sm font-medium text-charcoal no-underline hover:bg-marigold/20"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
