import type { ReactNode } from 'react';
import { cn } from '@/utils/classNames';

interface VideoEmbedProps {
  src: string;
  title: string;
  /** Opens the video directly, for anyone the frame does not work for. */
  fallbackHref?: string;
  /**
   * Usercentrics service name. Tagging the frame lets the consent manager
   * recognise it, hold it until the visitor opts in, and release it when
   * they do — instead of leaving a silently broken box behind.
   */
  consentService?: string;
  /** Rendered under the caption — normally the consent explanation. */
  children?: ReactNode;
  className?: string;
}

/**
 * 16:9 responsive embed. `loading="lazy"` keeps a third-party frame off the
 * critical path.
 */
export const VideoEmbed = ({
  src,
  title,
  fallbackHref,
  consentService,
  children,
  className,
}: VideoEmbedProps) => (
  <figure className={cn('m-0', className)}>
    <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-charcoal shadow-card hc-outline">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="fullscreen; picture-in-picture"
        allowFullScreen
        {...(consentService ? { 'data-usercentrics': consentService } : {})}
        className="absolute inset-0 size-full border-0"
      />
    </div>

    <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs leading-relaxed text-warm-grey">
      {children}
      {fallbackHref ? (
        <a
          href={fallbackHref}
          target="_blank"
          rel="noreferrer noopener"
          className="font-semibold text-terracotta underline underline-offset-2"
        >
          Open the video in a new tab
        </a>
      ) : null}
    </figcaption>
  </figure>
);
