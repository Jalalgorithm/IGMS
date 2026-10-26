import assistiveTech from '@/assets/images/focus-assistive-tech.jpg';
import launchpad from '@/assets/images/focus-launchpad.jpg';
import lift from '@/assets/images/focus-lift.jpg';
import stem from '@/assets/images/focus-stem.jpg';
import menoSpaces from '@/assets/images/about-lets-talk-menopause.jpg';
import megBadge from '@/assets/brand/meg-licensed-champion-2026.png';
import mark from '@/assets/brand/igms-mark.png';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { LinkButton } from '@/components/ui/Button';
import { scrollToSection } from '@/utils/scrollToSection';
import { ORG } from '../navigation';
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
    summary: 'An inclusive career preparation platform. Six pathways, one platform.',
    image: launchpad,
    alt: 'Three people laughing together over laptops at a shared table',
  },
  {
    targetId: 'menospaces',
    label: 'MenoSPACES',
    summary: 'Inclusive, accessible places where women in midlife can rest, learn and get support.',
    image: menoSpaces,
    alt: 'Illustration of five women of different ages and backgrounds talking together over tea',
    // Frame the women, not the heading printed at the top of the artwork.
    illustration: { position: '50% 62%' },
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
        title="Five focus areas, one mission"
        align="center"
      />
    </Reveal>

    <ul className="m-0 grid grid-cols-1 list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                  className={`${area.illustration ? '' : 'photo-grade '}size-full object-cover transition-transform duration-500 group-hover:scale-105`}
                  style={area.illustration ? { objectPosition: area.illustration.position } : undefined}
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

    {/* MenoSPACES: the fifth card points here. A call for spaces rather than
        a full section, because the programme is still being built. */}
    <Reveal
      id="menospaces"
      className="mt-14 flex flex-col items-start gap-6 rounded-[var(--radius-card)] bg-white p-6 shadow-card hc-outline sm:p-8 lg:flex-row lg:items-center lg:gap-8"
    >
      <div className="flex shrink-0 flex-col items-center gap-1 max-lg:hidden">
        <img src={mark} alt="" aria-hidden="true" className="h-16 w-auto object-contain" />
        <span className="font-display text-sm font-semibold text-terracotta">IGMS</span>
      </div>
      <div className="min-w-0 flex-1">
        <span className="mb-3 inline-block rounded-full bg-marigold px-3 py-[0.3125rem] font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-charcoal">
          Get involved
        </span>
        <h3 className="m-0 mb-2 font-display text-2xl font-semibold text-charcoal">
          Have a space to donate or rent?
        </h3>
        <p className="m-0 max-w-xl font-sans text-[0.9375rem] leading-relaxed text-charcoal/85">
          Help us open more MenoSPACES: inclusive, accessible places where women in midlife can
          rest, learn and get support.
        </p>
      </div>
      <LinkButton
        href={`mailto:${ORG.email}?subject=${encodeURIComponent('MenoSPACES: a space to donate or rent')}`}
        className="shrink-0"
      >
        Email {ORG.email}
      </LinkButton>
      <img
        src={megBadge}
        alt="Menopause Experts Licensed Champion 2026"
        width={240}
        height={217}
        loading="lazy"
        className="h-20 w-auto shrink-0 self-center max-sm:hidden"
      />
    </Reveal>
  </section>
);
