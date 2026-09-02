import type { ReactNode } from 'react';
import { cn } from '@/utils/classNames';

export type TagTone = 'solid' | 'outline';

interface TagProps {
  tone?: TagTone;
  className?: string;
  children: ReactNode;
}

/**
 * Pill used for the tag rows. `solid` is marigold with charcoal text — never
 * marigold text, and never white on marigold.
 */
export const Tag = ({ tone = 'solid', className, children }: TagProps) => (
  <span
    className={cn(
      'inline-block whitespace-nowrap rounded-full font-sans text-xs font-semibold',
      tone === 'solid'
        ? 'bg-marigold px-4 py-2 text-charcoal'
        : 'border border-charcoal/20 px-4 py-[0.4375rem] font-medium text-charcoal',
      className,
    )}
  >
    {children}
  </span>
);
