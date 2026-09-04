import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { VideoEmbed } from '@/components/shared/VideoEmbed';
import { LinkButton } from '@/components/ui/Button';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { Tag } from '@/components/ui/Tag';
import { PrivacySettingsButton } from '@/features/legal/components/PrivacySettingsButton';
import { PARTNER_LINKS } from '../navigation';

const SETTINGS = ['Health', 'Faith', 'Education', 'Veterans', 'Community', 'Justice'] as const;

/**
 * `dnt=1` asks Vimeo not to track the session — worth having on a site that
 * runs a consent manager, since it keeps the embed defensible before anyone
 * has opted in.
 */
const VIDEO_EMBED_URL = 'https://player.vimeo.com/video/1216001720?dnt=1';
const VIDEO_WATCH_URL = 'https://vimeo.com/1216001720';

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
        <VideoEmbed
          src={VIDEO_EMBED_URL}
          title="The Lift Project — programme introduction"
          fallbackHref={VIDEO_WATCH_URL}
          consentService="Vimeo"
        >
          <span>Hosted on Vimeo. If your cookie choices block third-party embeds it will not appear here.</span>
          <PrivacySettingsButton tone="light" label="Change cookie settings" className="text-xs" />
          <span aria-hidden="true">·</span>
        </VideoEmbed>

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
