import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { useWaitlistUiStore } from '@/stores/waitlistUiStore';
import type { ProgrammeId } from '@/features/waitlist';

const PROGRAMME_IDS: readonly ProgrammeId[] = [
  'lift-project',
  'stem-sports',
  'launchpad-adult',
  'launchpad-thrive101',
  'launchpad-school',
  'launchpad-veterans',
  'launchpad-rise-plus',
];

export const GetInvolved = () => {
  const requestWaitlistFocus = useWaitlistUiStore((state) => state.requestFocus);

  return (
    <section
      id="get-involved"
      aria-labelledby="get-involved-heading"
      className="mx-auto max-w-[80rem] px-6 pb-28 md:px-12"
    >
      <Reveal className="mb-10">
        <SectionHeading id="get-involved-heading" title="Get involved" />
      </Reveal>

      <div className="mb-5 grid gap-6 md:grid-cols-2">
        <Reveal className="rounded-[var(--radius-card)] bg-terracotta/8 p-9 hc-outline">
          <div className="mb-3 flex min-h-7 items-start justify-between gap-4">
            <p className="m-0 font-display text-xl font-semibold text-terracotta">
              Join a programme
            </p>
            <StatusChip kind="live" />
          </div>
          <p className="m-0 mb-6 font-sans text-[0.9375rem] leading-[1.7] text-charcoal">
            Thrive101, Adult pathway, School edition, Veterans &amp; spouses, RISE+, or The
            Lift Project. Places are limited and some have not opened yet — the waitlist is
            how you hear first.
          </p>
          <Button onClick={() => requestWaitlistFocus([...PROGRAMME_IDS])}>
            Join the waitlist
          </Button>
        </Reveal>

        {/* Addressed directly by "Request access" in the header's Join menu. */}
        <Reveal
          id="resources-guidebooks"
          className="rounded-[var(--radius-card)] bg-marigold/12 p-9 hc-outline"
        >
          <div className="mb-3 flex min-h-7 items-start justify-between gap-4">
            <p className="m-0 font-display text-xl font-semibold text-terracotta">
              Resources &amp; Guidebooks
            </p>
          </div>
          <p className="m-0 mb-6 font-sans text-[0.9375rem] leading-[1.7] text-charcoal">
            A gated resource library for partners, referrers and participants.
          </p>
          <Button
            variant="secondary"
            onClick={() => requestWaitlistFocus(['resources-guidebooks'])}
          >
            Request access
          </Button>
        </Reveal>
      </div>

      <p className="m-0 font-sans text-sm text-warm-grey">
        Prefer to give directly? The Donate button is at the top of the page.
      </p>
    </section>
  );
};
