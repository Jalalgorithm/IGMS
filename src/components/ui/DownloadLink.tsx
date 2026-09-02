import { cn } from '@/utils/classNames';

interface DownloadLinkProps {
  href: string;
  label: string;
  /** e.g. "PDF, 241 KB" — stated up front so nobody clicks blind. */
  meta: string;
  description?: string;
  className?: string;
  /** `card` gets its own surface; `inline` sits in a run of text. */
  variant?: 'card' | 'inline';
}

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" aria-hidden="true">
    <path
      d="M12 3v11m0 0 4-4m-4 4-4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * A download is not the same action as navigating, so it does not reuse the
 * button styles. The file type and size are part of the accessible name —
 * a screen reader announces what is about to be downloaded, not just "PDF".
 */
export const DownloadLink = ({
  href,
  label,
  meta,
  description,
  className,
  variant = 'card',
}: DownloadLinkProps) => {
  if (variant === 'inline') {
    return (
      <a
        href={href}
        download
        className={cn(
          'inline-flex items-center gap-2 font-sans text-sm font-semibold text-terracotta underline decoration-[1.5px] underline-offset-4 hover:text-charcoal hover:decoration-charcoal',
          className,
        )}
      >
        <DownloadIcon />
        <span>
          {label}{' '}
          <span className="font-normal text-warm-grey">({meta})</span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={href}
      download
      className={cn(
        'group flex items-start gap-4 rounded-[var(--radius-tile)] border-[1.5px] border-sand bg-white p-5 no-underline transition-colors duration-150 hover:border-terracotta',
        className,
      )}
    >
      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-marigold text-charcoal">
        <DownloadIcon />
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-sans text-[0.9375rem] font-semibold text-charcoal group-hover:text-terracotta">
          {label}
        </span>
        {description ? (
          <span className="font-sans text-[0.8125rem] leading-relaxed text-charcoal/75">
            {description}
          </span>
        ) : null}
        <span className="font-sans text-xs text-warm-grey">{meta}</span>
      </span>
    </a>
  );
};
