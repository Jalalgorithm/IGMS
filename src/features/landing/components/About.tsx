import collaboration from '@/assets/images/about-collaboration.jpg';
import outdoors from '@/assets/images/about-outdoors.jpg';
import session from '@/assets/images/about-session.jpg';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StatusChip } from '@/components/ui/StatusChip';

const PRINCIPLES = [
  {
    lead: 'Co-created with lived experience',
    body: 'every programme starts with people who have lived the problem.',
  },
  {
    lead: 'Built on reasonable adjustment',
    body: 'we ask what people need, then build around it.',
  },
  {
    lead: 'Measured by real change',
    body: 'outcomes we track and report, not just activity.',
  },
  {
    lead: 'Reducing isolation',
    body: 'for disabled people, veterans, NEET young people, and anyone locked out of opportunity.',
  },
] as const;

export const About = () => (
  <section
    id="about"
    aria-labelledby="about-heading"
    className="mx-auto max-w-[80rem] px-6 pb-32 md:px-12"
  >
    <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-[4.5rem]">
      {/* Asymmetric collage — deliberately not a tidy grid, so this section
          cannot be mistaken for the card rows further down the page. */}
      <Reveal className="relative min-h-[32.5rem] hidden lg:block">
        <div className="absolute left-0 top-0 h-[66%] w-[72%] overflow-hidden rounded-[1.25rem] shadow-lifted">
          <img
            src={collaboration}
            alt="Four colleagues talking around a table with a tablet in a bright café"
            className="photo-grade size-full object-cover"
          />
        </div>

        <div className="absolute bottom-0 right-0 h-[52%] w-[56%] overflow-hidden rounded-[1.25rem] border-[6px] border-ivory shadow-lifted">
          <img
            src={outdoors}
            alt="A group of friends of different ages and ethnicities outdoors, one of them a wheelchair user"
            className="photo-grade size-full object-cover"
          />
        </div>

        <div className="absolute left-[58%] top-[36%] h-[34%] w-[38%] overflow-hidden rounded-[1rem] border-[6px] border-ivory shadow-lifted">
          <img
            src={session}
            alt="Attendees seated at a community education session"
            className="photo-grade size-full object-cover"
          />
        </div>

        <div className="absolute -left-8 top-[8%] max-w-[11.875rem] rounded-2xl bg-terracotta px-6 py-5 text-ivory shadow-lifted">
          <p className="m-0 font-display text-[1.0625rem] font-semibold leading-tight">
            4 focus areas. One mission.
          </p>
        </div>

        <div className="absolute -bottom-7 left-[14%] flex items-center gap-3 whitespace-nowrap rounded-full border-[1.5px] border-charcoal/15 bg-ivory py-2 pl-4 pr-2 shadow-card">
          <span className="font-sans text-xs text-warm-grey">Impact figures to follow</span>
          <StatusChip kind="placeholder" />
        </div>
      </Reveal>

      {/* Stacked images on small screens, where the overlap would collapse. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        <img
          src={collaboration}
          alt="Four colleagues talking around a table with a tablet in a bright café"
          className="photo-grade h-56 w-full rounded-[1.25rem] object-cover shadow-card sm:col-span-2"
        />
        <img
          src={outdoors}
          alt="A group of friends of different ages and ethnicities outdoors, one of them a wheelchair user"
          className="photo-grade h-40 w-full rounded-[1.25rem] object-cover shadow-card"
        />
        <img
          src={session}
          alt="Attendees seated at a community education session"
          className="photo-grade h-40 w-full rounded-[1.25rem] object-cover shadow-card"
        />
      </div>

      <Reveal>
        <SectionHeading
          id="about-heading"
          eyebrow="About IGMS"
          title="Community programmes built with the people they serve."
        />

        <p className="m-0 mb-8 mt-6 max-w-lg font-sans text-[1.0625rem] leading-[1.7] text-charcoal">
          IGMS designs digital tools and community programmes across disability &amp; access,
          wellbeing, STEM education, and employability — shaped with the people who use them,
          not for them.
        </p>

        <ul className="m-0 flex list-none flex-col gap-5 p-0">
          {PRINCIPLES.map((principle) => (
            <li key={principle.lead} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-2.5 size-2 shrink-0 rounded-full bg-marigold"
              />
              <p className="m-0 font-sans text-base leading-relaxed text-charcoal">
                <strong className="font-semibold text-terracotta">{principle.lead}</strong> —{' '}
                {principle.body}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>

    {/* Mission and vision run the full width below the collage. Dropping them
        into the right-hand column would have made an already tall block
        taller, and buried the two statements the organisation is defined by. */}
    <Reveal className="mt-24 border-t-[3px] border-marigold pt-12">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h3 className="m-0 mb-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-warm-grey">
            Mission
          </h3>
          <p className="m-0 font-display text-[clamp(1.25rem,2.2vw,1.625rem)] font-medium leading-snug text-terracotta">
            We co-create tools and programmes that build real access, real skills, and real
            opportunity — with the people who live it.
          </p>
        </div>

        <div>
          <h3 className="m-0 mb-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-warm-grey">
            Vision
          </h3>
          <p className="m-0 font-display text-[clamp(1.25rem,2.2vw,1.625rem)] font-medium leading-snug text-terracotta">
            A world where everyone thrives, in communities built on lived experience and real
            opportunity.
          </p>
        </div>
      </div>
    </Reveal>
  </section>
);
