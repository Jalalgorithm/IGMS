import type { ReactNode } from 'react';
import { cn } from '@/utils/classNames';

interface SectionHeadingProps {
  /** Small uppercase kicker above the heading. */
  eyebrow?: string;
  title: ReactNode;
  /** Rendered inline after the title — normally a StatusChip. */
  adornment?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
  as?: 'h2' | 'h3';
}

export const SectionHeading = ({
  eyebrow,
  title,
  adornment,
  align = 'left',
  className,
  id,
  as: Tag = 'h2',
}: SectionHeadingProps) => (
  <div className={cn(align === 'center' && 'text-center', className)}>
    {eyebrow ? (
      <p className="mb-3 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-terracotta">
        {eyebrow}
      </p>
    ) : null}
    <div
      className={cn(
        'flex flex-wrap items-center gap-4',
        align === 'center' && 'justify-center',
      )}
    >
      <Tag
        id={id}
        className="m-0 font-display text-[clamp(1.75rem,3vw,2.375rem)] font-semibold leading-[1.2] text-terracotta"
      >
        {title}
      </Tag>
      {adornment}
    </div>
  </div>
);
