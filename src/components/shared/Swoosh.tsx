import { cn } from '@/utils/classNames';

type SwooshVariant = 'a' | 'b' | 'c';

/**
 * The arcing stroke lifted from the IGMS mark, reduced to a single line and
 * reused between sections. It is the thread that ties otherwise unrelated
 * content blocks into one identity, so the three variants only differ in
 * phase — never in weight or colour.
 */
const PATHS: Record<SwooshVariant, string> = {
  a: 'M0,50 Q400,-10 800,40 T1600,20',
  b: 'M0,20 Q400,60 800,24 T1600,44',
  c: 'M0,44 Q400,-6 800,36 T1600,16',
};

interface SwooshProps {
  variant?: SwooshVariant;
  className?: string;
}

export const Swoosh = ({ variant = 'a', className }: SwooshProps) => (
  <div className={cn('relative h-16 overflow-hidden', className)} aria-hidden="true">
    <svg viewBox="0 0 1600 64" preserveAspectRatio="none" className="block h-full w-full">
      <path
        d={PATHS[variant]}
        fill="none"
        stroke="var(--color-marigold)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
