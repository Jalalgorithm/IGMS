import assistiveTech from '@/assets/images/focus-assistive-tech.jpg';
import launchpad from '@/assets/images/focus-launchpad.jpg';
import lift from '@/assets/images/focus-lift.jpg';
import stem from '@/assets/images/focus-stem.jpg';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { scrollToSection } from '@/utils/scrollToSection';
import type { FocusArea } from '../types';

const AREAS: readonly FocusArea[] = [
  {
    targetId: 'disability-access',
    label: 'Disability & Access',
    summary:
      'Accessible, digitally inclusive solutions from transport barriers to assistive technology.',
    image: assistiveTech,
    alt: 'A wheelchair user working on a laptop resting across their lap',
  },
  {
    targetId: 'lift-project',
    label: 'The Lift Project',
    summary: 'An evidence-based wellbeing programme across health, faith, education and more.',
    image: lift,
    alt: 'Two people reaching towards each other, fingertips almost touching',
  },
  {
    targetId: 'stem-sports',
    label: 'STEM through Sport',
    summary: 'STEM, AI, green skills and digital literacy for everyone told it was not for them.',
    image: stem,
    alt: 'A coach with a tactics board talking to a team of young wheelchair basketball players',
  },
  {
    targetId: 'launchpad',
    label: 'LaunchPad101',
    summary: 'An inclusive career preparation platform. Five pathways, one platform.',
    image: launchpad,
    alt: 'Three people laughing together over laptops at a shared table',
  },
];

export const FocusAreas = () => (
  <section
    id="focus-areas"
    aria-labelledby="focus-areas-heading"
    className="mx-auto max-w-[80rem] px-6 pb-32 md:px-12"
  >
    <Reveal className="mx-auto mb-14 max-w-2xl">
      <SectionHeading
        id="focus-areas-heading"
        eyebrow="What we do"
        title="Four focus areas, one mission"
        align="center"
      />
    </Reveal>

    <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-4">
      {AREAS.map((area) => (
        <li key={area.targetId} className="contents">
          <Reveal className="h-full">
            <a
              href={`#${area.targetId}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(area.targetId);
              }}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white text-inherit no-underline shadow-card transition-transform duration-300 hover:-translate-y-1 hc-outline"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={area.image}
                  alt={area.alt}
                  className="photo-grade size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-3 inline-block w-fit whitespace-nowrap rounded-full bg-marigold px-3 py-[0.3125rem] font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.03em] text-charcoal">
                  {area.label}
                </span>
                <p className="m-0 font-sans text-sm leading-relaxed text-charcoal">
                  {area.summary}
                </p>
              </div>
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  </section>
);
