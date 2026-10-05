import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Loading } from '@/components/shared/Loading';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { useWaitlistUiStore } from '@/stores/waitlistUiStore';

/**
 * The form carries the phone-number rules for every country (~30 KB gzip),
 * so it is split out of the first load and fetched once the page is idle —
 * normally long before anyone scrolls this far.
 */
const loadForm = () => import('./WaitlistForm');
const WaitlistForm = lazy(() => loadForm().then((module) => ({ default: module.WaitlistForm })));

const preloadWhenIdle = () => {
  // Safari has no requestIdleCallback; a short timeout is close enough there.
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => void loadForm(), { timeout: 3000 });
  } else {
    setTimeout(() => void loadForm(), 1500);
  }
};

/** Signals once the lazily loaded form has actually mounted. */
const MountSignal = ({ onMount }: { onMount: () => void }) => {
  useEffect(onMount, [onMount]);
  return null;
};

/**
 * The waitlist section as it sits on the landing page. Owns the scroll-and-
 * focus behaviour for the "Join the waitlist" buttons elsewhere on the page.
 */
export const WaitlistSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const requestedFocusAt = useWaitlistUiStore((state) => state.requestedFocusAt);
  const clearFocusRequest = useWaitlistUiStore((state) => state.clearFocusRequest);
  const [formReady, setFormReady] = useState(false);
  const markFormReady = useRef(() => setFormReady(true)).current;

  useEffect(preloadWhenIdle, []);

  useEffect(() => {
    if (requestedFocusAt === null) return;
    const node = sectionRef.current;
    if (!node) return;

    const reduced = document.documentElement.dataset['motion'] === 'reduced';
    node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    // If the form is still loading, keep the request until it mounts.
    if (!formReady) return;
    node.querySelector<HTMLInputElement>('input[name="programmes"]')?.focus();
    clearFocusRequest();
  }, [requestedFocusAt, clearFocusRequest, formReady]);

  return (
    <section
      ref={sectionRef}
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="bg-terracotta/8 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal className="mb-10">
          <SectionHeading
            id="waitlist-heading"
            eyebrow="Join the waitlist"
            title="Tell us which programme is for you."
          />
          <p className="m-0 mt-5 max-w-2xl font-sans text-[1.0625rem] leading-relaxed text-charcoal">
            Most of what we build is not open to everyone at once — places are limited and
            some programmes have not launched yet. Put your name down and we will contact
            you directly when the one you have chosen opens.
          </p>
        </Reveal>

        <Reveal>
          <Suspense fallback={<Loading label="Loading the waitlist form" />}>
            <WaitlistForm />
            <MountSignal onMount={markFormReady} />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
};
