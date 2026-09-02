import type { ElementType, ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/utils/classNames';

interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
}

/**
 * Scroll-entry reveal. The transition itself is disabled by the reduce-motion
 * preference (either the OS setting or the reader control) in index.css.
 */
export const Reveal = ({ as: Tag = 'div', className, children, id }: RevealProps) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <Tag ref={ref} id={id} className={cn('reveal', className)}>
      {children}
    </Tag>
  );
};
