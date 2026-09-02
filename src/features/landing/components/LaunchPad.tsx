import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { useWaitlistUiStore } from '@/stores/waitlistUiStore';
import type { ProgrammeId } from '@/features/waitlist';
import type { PathwayCard } from '../types';

/** Order is fixed by the brief and mirrors the waitlist catalogue. */
const PATHWAYS: ReadonlyArray<PathwayCard & { programmeId: ProgrammeId }> = [
  {
    name: 'Adult pathway',
    audience: 'Return-to-work, optional ESOL/RQF Level 6+',
    programmeId: 'launchpad-adult',
  },
  { name: 'Thrive101', audience: 'NEET, ages 16–24', programmeId: 'launchpad-thrive101' },
  { name: 'School edition', audience: 'Ages 11–16', programmeId: 'launchpad-school' },
  {
    name: 'Veterans & spouses',
    audience: 'Transition support',
    programmeId: 'launchpad-veterans',
  },
  { name: 'RISE+', audience: 'Ages 13–16', programmeId: 'launchpad-rise-plus' },
];

export const LaunchPad = () => {
  const requestWaitlistFocus = useWaitlistUiStore((state) => state.requestFocus);

  return (
    <section
      id="launchpad"
      aria-labelledby="launchpad-heading"
      className="bg-marigold/10 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-[80rem]">
        <Reveal>
          <SectionHeading
            id="launchpad-heading"
            title="LaunchPad101"
            adornment={<StatusChip kind="coming-soon" />}
          />
        </Reveal>

        <Reveal>
          <p className="m-0 mb-6 mt-5 max-w-2xl font-sans text-base leading-[1.75] text-charcoal">
            An inclusive career preparation platform turning career gaps into an
            opportunity-focused narrative — AI interview practice, CV building, leadership
            development, and a NEET employability module. Five pathways, one platform.
          </p>
          <p className="m-0 mb-12 max-w-2xl font-sans text-[0.9375rem] text-warm-grey">
            None of the five is open yet. Choose the one that fits and we will tell you the
            day it launches.
          </p>
        </Reveal>

        {/* Informational cards — not links, because there is nowhere to go yet.
            The single call to action sits below them instead. */}
        <ul className="m-0 mb-12 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-5">
          {PATHWAYS.map((pathway) => (
            <li key={pathway.name} className="contents">
              <Reveal className="rounded-[var(--radius-tile)] bg-white px-[1.125rem] py-6 hc-outline">
                <p className="m-0 mb-2 font-display text-[0.9375rem] font-semibold text-terracotta">
                  {pathway.name}
                </p>
                <p className="m-0 font-sans text-[0.8125rem] leading-normal text-warm-grey">
                  {pathway.audience}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="flex flex-wrap items-center gap-4">
          <Button onClick={() => requestWaitlistFocus(PATHWAYS.map((p) => p.programmeId))}>
            Join the LaunchPad101 waitlist
          </Button>
          <p className="m-0 font-sans text-sm text-warm-grey">
            All five pathways will be ticked for you — untick any you do not want.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
