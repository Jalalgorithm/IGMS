import disabilityConfident from '@/assets/brand/dc-badge.png';
import heroImage from '@/assets/images/hero-community.jpg';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/shared/Reveal';
import { useWaitlistUiStore } from '@/stores/waitlistUiStore';
import { scrollToSection } from '@/utils/scrollToSection';
import { PARTNER_LINKS } from '../navigation';

export const Hero = () => {
  const requestWaitlistFocus = useWaitlistUiStore((state) => state.requestFocus);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[88vh] items-center pb-24 lg:pb-14"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Volunteers of different ages and backgrounds sitting together at a community garden in the UK"
          className="photo-grade-hero absolute inset-0 size-full object-cover object-[60%_30%]"
          fetchPriority="high"
          width={2000}
          height={1333}
        />
        <div
          className="hc-overlay absolute inset-0 bg-[linear-gradient(115deg,rgb(35_31_27/0.88)_10%,rgb(200_75_30/0.55)_75%)]"
          aria-hidden="true"
        />
      </div>

      <Reveal className="on-dark relative z-10 max-w-3xl px-6 text-ivory md:px-12">
        <h1
          id="hero-heading"
          className="m-0 mb-6 font-display text-[clamp(1.875rem,4vw,3.25rem)] font-semibold leading-[1.1] text-ivory"
        >
          The infrastructure inclusion has always deserved.
        </h1>

        <p className="m-0 mb-7 max-w-xl font-sans text-[clamp(1rem,1.4vw,1.0625rem)] leading-relaxed text-ivory/92">
          Digital innovation solutions and community programmes, co-created with lived
          experience, measured by real change.
        </p>

        <p className="m-0 mb-9 max-w-xl font-display text-[clamp(1.0625rem,1.6vw,1.1875rem)] font-medium leading-relaxed text-marigold">
          Dignity restored. Futures built. Real opportunity, real inclusion, real access — we
          help reduce isolation, for everyone.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 md:mt-16">
          <Button size="lg" onClick={() => requestWaitlistFocus()}>
            Join the waitlist
          </Button>
          <Button
            variant="secondary-on-dark"
            size="lg"
            onClick={() => scrollToSection('focus-areas')}
          >
            See our focus areas
          </Button>
        </div>

        {/* The badge artwork has dark text on a transparent ground, so it sits
            on a white chip to stay legible over the photo. */}
        <div className="mt-6 inline-flex rounded-xl bg-white px-3 py-2 shadow-card">
          <img
            src={disabilityConfident}
            alt="Disability Confident Committed employer"
            width={500}
            height={241}
            className="h-11 w-auto sm:h-12"
          />
        </div>
      </Reveal>

      {/* Charcoal on marigold (8.2:1) — the links stay charcoal rather than
          taking the terracotta link colour, which would fail on this ground. */}
      <Reveal className="absolute -bottom-9 right-6 z-20 hidden w-[21.25rem] rounded-2xl bg-marigold px-7 py-6 text-charcoal shadow-float lg:right-16 lg:block">
        <p className="m-0 font-display text-base font-semibold leading-normal">
          UK delivery partner —{' '}
          <a
            href={PARTNER_LINKS.liftProject}
            target="_blank"
            rel="noreferrer noopener"
            className="text-charcoal underline decoration-charcoal/40 underline-offset-4 hover:decoration-charcoal"
          >
            The Lift Project
          </a>{' '}
          &amp;{' '}
          <a
            href={PARTNER_LINKS.stemSports}
            target="_blank"
            rel="noreferrer noopener"
            className="text-charcoal underline decoration-charcoal/40 underline-offset-4 hover:decoration-charcoal"
          >
            STEM Sports
          </a>
        </p>
      </Reveal>
    </section>
  );
};
