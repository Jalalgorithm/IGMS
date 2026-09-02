import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/classNames';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `plain` sits on the ivory ground; `raised` is white with a soft shadow. */
  tone?: 'raised' | 'plain' | 'tint-terracotta' | 'tint-marigold';
  children: ReactNode;
}

const TONES: Record<NonNullable<CardProps['tone']>, string> = {
  raised: 'bg-white shadow-card hc-outline',
  plain: 'bg-transparent',
  'tint-terracotta': 'bg-terracotta/8 hc-outline',
  'tint-marigold': 'bg-marigold/12 hc-outline',
};

export const Card = ({ tone = 'raised', className, children, ...rest }: CardProps) => (
  <div className={cn('rounded-[var(--radius-card)]', TONES[tone], className)} {...rest}>
    {children}
  </div>
);
