import type { StatusKind } from '@/types';
import { cn } from '@/utils/classNames';

const LABELS: Record<StatusKind, string> = {
  live: 'Live',
  'coming-soon': 'Coming soon',
  'description-only': 'Description only',
  placeholder: 'Placeholder',
};

const STYLES: Record<StatusKind, string> = {
  // Charcoal on marigold — the correct pairing, 8.2:1.
  live: 'bg-marigold text-charcoal border-transparent',
  'coming-soon': 'bg-marigold text-charcoal border-transparent',
  'description-only': 'bg-ivory text-warm-grey border-sand',
  placeholder: 'bg-ivory text-warm-grey border-sand',
};

interface StatusChipProps {
  kind: StatusKind;
  className?: string;
  /** Override the label while keeping the shared shape. */
  label?: string;
}

/**
 * One chip for all four maturity states on the page. Every state goes through
 * here rather than being improvised per section — that is what keeps a page
 * with this much pending content reading as intentional.
 */
export const StatusChip = ({ kind, className, label }: StatusChipProps) => (
  <span
    className={cn(
      'inline-block shrink-0 whitespace-nowrap rounded-full border px-3 py-[0.3125rem] font-sans text-[0.625rem] font-semibold uppercase tracking-[0.04em]',
      STYLES[kind],
      className,
    )}
  >
    {label ?? LABELS[kind]}
  </span>
);
