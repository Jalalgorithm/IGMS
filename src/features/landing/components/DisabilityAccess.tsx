import { Link } from 'react-router';
import inclusiveTeam from '@/assets/images/disability-inclusive-team.jpg';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { LinkButton } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { ORG } from '../navigation';

const TAGS = [
  'Street works & transport access solutions',
  'Assistive technology',
  'Reasonable adjustment tooling',
  'Disabled adults & children',
] as const;

/** The anonymous street works report; /street-works is the project page and board. */
const REPORT_STREET_WORKS_PATH = '/report-street-works';

export const DisabilityAccess = () => (
  <section
    id="disability-access"
    aria-labelledby="disability-access-heading"
    className="mx-auto max-w-[80rem] px-6 pb-32 md:px-12"
  >
    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-[4.5rem]">
      <Reveal className="overflow-hidden rounded-[var(--radius-card)] shadow-lifted">
        <img
          src={inclusiveTeam}
          alt="A mixed team working together around a table, including a wheelchair user at a laptop"
          className="photo-grade size-full object-cover"
          loading="lazy"
        />
      </Reveal>

      <Reveal>
        <SectionHeading
          id="disability-access-heading"
          eyebrow="Focus area"
          title="This is the infrastructure disability has always deserved."
        />

        <p className="m-0 mb-6 mt-5 max-w-md font-sans text-base leading-[1.7] text-charcoal">
          Accessible, digitally inclusive, AI-immersive solutions addressing physical, social,
          behavioural and emotional needs — including loneliness — from street works and
          transport barriers to assistive technology.
        </p>

        <ul aria-label="What this covers" className="m-0 flex list-none flex-wrap gap-2.5 p-0">
          {TAGS.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        {/* Take part: the one action in this section, so it gets a card of its
            own rather than another pill. */}
        <div className="mt-8 flex flex-col gap-5 rounded-[var(--radius-card)] border-[1.5px] border-terracotta bg-white p-6 shadow-card hc-outline sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="m-0 mb-1 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-terracotta">
              Take part · Newham
            </p>
            <h3 className="m-0 font-display text-xl font-semibold leading-snug text-charcoal">
              Street works getting in your way?
            </h3>
            <p className="m-0 mt-1.5 font-sans text-sm leading-relaxed text-charcoal/80">
              Tell us how they affect your journey, work or wellbeing. Anonymous, 30 seconds.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2.5 sm:items-center">
            <Link
              to={REPORT_STREET_WORKS_PATH}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 font-sans text-[0.9375rem] font-semibold text-ivory no-underline transition-colors duration-200 hover:bg-terracotta-dark"
            >
              Report street works
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              to="/street-works"
              className="font-sans text-sm font-semibold text-terracotta underline underline-offset-4 hover:text-charcoal"
            >
              See the hotspot board
            </Link>
          </div>
        </div>
      </Reveal>
    </div>

    {/* Contact: for partners, funders and pilots rather than people reporting. */}
    <Reveal className="mx-auto mt-16 flex max-w-2xl flex-col gap-4 rounded-[var(--radius-card)] border-[1.5px] border-sand bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:pl-8 sm:pr-3">
      <div>
        <h3 className="m-0 font-display text-lg font-semibold text-terracotta">
          Want to know what we&rsquo;re building?
        </h3>
        <p className="m-0 font-sans text-sm text-charcoal/80">
          Email us to partner, fund, pilot or just ask —{' '}
          <span className="select-all font-medium text-charcoal">{ORG.email}</span>
        </p>
      </div>
      <LinkButton
        href={`mailto:${ORG.email}?subject=${encodeURIComponent('Disability & Access')}`}
        className="shrink-0 self-start sm:self-center"
      >
        Email us
      </LinkButton>
    </Reveal>
  </section>
);
