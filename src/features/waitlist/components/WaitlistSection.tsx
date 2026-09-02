import { useEffect, useRef } from 'react';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { useWaitlistUiStore } from '@/stores/waitlistUiStore';
import { WaitlistForm } from './WaitlistForm';

/**
 * The waitlist section as it sits on the landing page. Owns the scroll-and-
 * focus behaviour for the "Join the waitlist" buttons elsewhere on the page.
 */
export const WaitlistSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const requestedFocusAt = useWaitlistUiStore((state) => state.requestedFocusAt);
  const clearFocusRequest = useWaitlistUiStore((state) => state.clearFocusRequest);

  useEffect(() => {
    if (requestedFocusAt === null) return;
    const node = sectionRef.current;
    if (!node) return;

    const reduced = document.documentElement.dataset['motion'] === 'reduced';
    node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    node.querySelector<HTMLInputElement>('input[name="programmes"]')?.focus();
    clearFocusRequest();
  }, [requestedFocusAt, clearFocusRequest]);

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
          <WaitlistForm />
        </Reveal>
      </div>
    </section>
  );
};
