import { StatusChip } from '@/components/ui/StatusChip';
import { cn } from '@/utils/classNames';

interface PlaceholderBlockProps {
  /** What will eventually sit here, e.g. "poster". */
  label: string;
  className?: string;
}

/**
 * Deliberate empty slot. Marked with the shared status chip so a visitor
 * reads "not filled in yet" rather than "broken".
 */
export const PlaceholderBlock = ({ label, className }: PlaceholderBlockProps) => (
  <div
    className={cn(
      'relative flex items-center justify-center rounded-[var(--radius-card)] border border-dashed border-sand bg-white',
      className,
    )}
  >
    <span className="font-mono text-xs text-warm-grey">{label} placeholder</span>
    <StatusChip kind="placeholder" className="absolute right-3 top-3" />
  </div>
);
