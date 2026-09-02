import { useEffect, useState } from 'react';
import { Loading } from '@/components/shared/Loading';
import { termageddonFallbackUrl } from '../policies';

interface PolicyEmbedProps {
  embedId: string;
  title: string;
}

const SCRIPT_TIMEOUT_MS = 8000;

/**
 * Mounts one Termageddon policy.
 *
 * Their script finds a div whose id is the policy key and writes the policy
 * into it, so the div has to exist before the script runs — which it does,
 * because effects fire after commit. The script is appended per mount and
 * removed on unmount so client-side navigation between two policies does not
 * leave the previous one's script behind.
 */
export const PolicyEmbed = ({ embedId, title }: PolicyEmbedProps) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    setStatus('loading');

    const script = document.createElement('script');
    script.src = `https://policies.termageddon.com/api/embed/${embedId}.js`;
    script.async = true;
    script.onerror = () => setStatus('failed');
    document.body.appendChild(script);

    // The script reports nothing on success, so treat "the div grew content"
    // as ready and a silent timeout as failed. Without this, a blocked script
    // leaves the visitor staring at "Please wait" forever.
    const observed = document.getElementById(embedId);
    const observer = observed
      ? new MutationObserver(() => setStatus('ready'))
      : null;
    if (observed && observer) {
      observer.observe(observed, { childList: true, subtree: true });
    }

    const timer = window.setTimeout(() => {
      setStatus((current) => (current === 'ready' ? current : 'failed'));
    }, SCRIPT_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      script.remove();
    };
  }, [embedId]);

  return (
    <>
      {/* Not `inline`: that variant hides the label from sight, which would
          leave a bare spinner and waste the text styling passed with it. */}
      {status === 'loading' ? (
        <Loading label={`Loading ${title.toLowerCase()}`} className="text-warm-grey" />
      ) : null}

      {status === 'failed' ? (
        <p
          role="alert"
          className="m-0 mb-8 rounded-xl border-[1.5px] border-terracotta bg-terracotta/8 px-5 py-4 font-sans text-sm leading-relaxed text-charcoal"
        >
          The {title.toLowerCase()} could not be loaded here — an ad blocker or your cookie
          choices may be blocking it.{' '}
          <a
            rel="nofollow noreferrer noopener"
            href={termageddonFallbackUrl(embedId)}
            target="_blank"
            className="font-semibold text-terracotta underline underline-offset-4"
          >
            Read it on Termageddon instead
          </a>
          .
        </p>
      ) : null}

      {/* Termageddon addresses this div by id and replaces its contents. */}
      <div
        id={embedId}
        aria-busy={status === 'loading'}
        className="policy_embed_div font-sans leading-relaxed text-charcoal"
      />
    </>
  );
};
