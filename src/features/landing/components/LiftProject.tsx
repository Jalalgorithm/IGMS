import poster from '@/assets/images/lift-project-poster.jpg';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { LinkButton } from '@/components/ui/Button';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { Tag } from '@/components/ui/Tag';
import { PARTNER_LINKS } from '../navigation';

const SETTINGS = ['Health', 'Faith', 'Education', 'Veterans', 'Community', 'Justice'] as const;

export const LiftProject = () => (
  <section
    id="lift-project"
    aria-labelledby="lift-project-heading"
    className="bg-terracotta/8 px-6 py-24 md:px-12"
  >
    <div className="mx-auto grid max-w-[80rem] items-start gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-[4.5rem]">
      <Reveal>
        <SectionHeading
          id="lift-project-heading"
          eyebrow="Focus area"
          title="The Lift Project"
        />

        <p className="m-0 mb-5 mt-5 max-w-xl font-sans text-base leading-[1.75] text-charcoal">
          The Lift Project is a premier mental health &amp; wellbeing programme that uniquely
          brings together evidence-based strategies drawn from research in the fields of
          Neuroscience, Lifestyle Medicine and Positive Psychology.
        </p>

        <p className="m-0 mb-5 max-w-xl font-sans text-base leading-[1.75] text-charcoal">
          It is woven across health, faith, education, veterans, community and justice
          settings. Developed by Dr Norton, with large-scale global impact.
        </p>

        <p className="m-0 mb-6 font-display text-lg font-medium leading-relaxed text-terracotta">
          IGMS is the UK Endorsed delivery partner for{' '}
          <a
            href={PARTNER_LINKS.liftProject}
            target="_blank"
            rel="noreferrer noopener"
            className="text-terracotta underline decoration-[1.5px] underline-offset-4 hover:text-charcoal hover:decoration-charcoal"
          >
            The Lift Project
          </a>
          .
        </p>

        <ul className="m-0 mb-4 flex list-none flex-wrap gap-2.5 p-0">
          {SETTINGS.map((setting) => (
            <li key={setting}>
              <Tag tone="outline">{setting}</Tag>
            </li>
          ))}
        </ul>

        {/* Sits directly under the settings row, against "Veterans". */}
        <p className="m-0 mb-7">
          <DownloadLink
            variant="inline"
            href="/documents/the-lift-project-military-use-case.pdf"
            label="How we support veterans"
            meta="PDF, 241 KB"
          />
        </p>

        <p className="m-0 mb-3 max-w-xl font-sans text-[0.9375rem] leading-[1.7] text-charcoal">
          A monthly live session with Dr Darren: a 10-minute wellbeing insight, followed by
          discussion.
        </p>

        <LinkButton href={PARTNER_LINKS.liftProject} variant="tertiary" external>
          Visit theliftproject.global
        </LinkButton>
      </Reveal>

      <Reveal className="flex flex-col gap-5">
        {/* Supplied as a one-page PDF and rendered to an image, so it shows
            inline instead of prompting a download. The strapline printed on
            the poster is repeated as real text below it — an alt attribute is
            not a substitute for content anyone might want to select or search. */}
        <figure className="m-0">
          <img
            src={poster}
            alt="Three generations of a family walking hand in hand through woodland, smiling."
            className="w-full rounded-[var(--radius-card)] object-cover shadow-card hc-outline"
            loading="lazy"
            width={1100}
            height={1424}
          />
          <figcaption className="mt-3 font-sans text-[0.9375rem] leading-relaxed text-charcoal">
            An evidence-based, 10-week adventure designed to help you take charge of your own
            wellbeing in a fun and simple way.
          </figcaption>
        </figure>

        <DownloadLink
          href="/documents/the-lift-project-corporate-brochure.pdf"
          label="The Lift Project — corporate summary"
          description="The full brochure: what the programme covers, how it is delivered, and the evidence behind it."
          meta="PDF, 351 KB"
        />
      </Reveal>
    </div>
  </section>
);
