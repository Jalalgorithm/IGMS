import stemSportsLogo from '@/assets/brand/stem-sports-logo.png';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { VideoEmbed } from '@/components/shared/VideoEmbed';
import { LinkButton } from '@/components/ui/Button';
import { PrivacySettingsButton } from '@/features/legal/components/PrivacySettingsButton';
import { PARTNER_LINKS } from '../navigation';

/**
 * View-only Canva link. The link originally supplied pointed at `/edit`,
 * which would hand every visitor edit rights on the source design.
 */
const VIDEO_EMBED_URL =
  'https://www.canva.com/design/DAHQmzCcqW4/p6-VmySpXICOjBrD0Bi0UA/watch?embed';
const VIDEO_WATCH_URL =
  'https://www.canva.com/design/DAHQmzCcqW4/p6-VmySpXICOjBrD0Bi0UA/watch';

const STATS = [
  { value: '16+', caption: 'Hours of instruction per curriculum', large: true },
  { value: '12+', caption: 'Sports covered', large: true },
  { value: 'Year 1–9 + SEN', caption: 'Plus special education', large: false },
] as const;

export const StemSports = () => (
  <section
    id="stem-sports"
    aria-labelledby="stem-sports-heading"
    className="mx-auto max-w-[80rem] px-6 py-24 md:px-12"
  >
    <Reveal className="mb-12 max-w-2xl">
      <SectionHeading id="stem-sports-heading" eyebrow="Focus area" title="STEM Sports" />
      <p className="m-0 mt-5 font-sans text-base leading-[1.75] text-charcoal">
        STEM, AI, green skills and digital literacy for everyone who was told it was not for
        them — forces through basketball, gravity through golf, engineering through equipment
        design, probability through penalty kicks.
      </p>
    </Reveal>

    <p className="m-0 mb-10 font-display text-xl font-medium leading-relaxed text-terracotta">
      IGMS is also the UK delivery partner for{' '}
      <a
        href={PARTNER_LINKS.stemSports}
        target="_blank"
        rel="noreferrer noopener"
        className="text-terracotta underline decoration-[1.5px] underline-offset-4 hover:text-charcoal hover:decoration-charcoal"
      >
        STEM Sports
      </a>
      .
    </p>

    {/* Oversized numerals — the one place on the page where the number, not
        the sentence, is the thing being read. */}
    <ul className="m-0 mb-14 grid list-none gap-6 p-0 sm:grid-cols-3">
      {STATS.map((stat) => (
        <li key={stat.value} className="contents">
          <Reveal className="rounded-[var(--radius-card)] bg-white px-4 py-8 text-center shadow-card hc-outline">
            <p
              className={
                stat.large
                  ? 'm-0 mb-2 font-display text-[2.75rem] font-semibold leading-none text-marigold'
                  : 'm-0 mb-2 font-display text-[1.625rem] font-semibold leading-none text-marigold'
              }
            >
              {stat.value}
            </p>
            <p className="m-0 font-sans text-sm leading-normal text-charcoal">{stat.caption}</p>
          </Reveal>
        </li>
      ))}
    </ul>

    <p className="m-0 mb-10 font-sans text-[0.9375rem] leading-relaxed text-warm-grey">
      Zero specialist training needed for facilitators.
    </p>

    <div className="mb-14 grid items-center gap-8 lg:grid-cols-[1.6fr_1fr]">
      <Reveal>
        <VideoEmbed
          src={VIDEO_EMBED_URL}
          title="STEM Sports programme overview"
          fallbackHref={VIDEO_WATCH_URL}
          consentService="Canva"
        >
          {/* Worded to hold whether or not Canva is a gated service in the
              Usercentrics configuration — it may simply be blocked by an
              extension instead. */}
          <span>Hosted on Canva. If your cookie choices block third-party embeds it will not appear here.</span>
          <PrivacySettingsButton tone="light" label="Change cookie settings" className="text-xs" />
          <span aria-hidden="true">·</span>
        </VideoEmbed>
      </Reveal>

      <Reveal className="flex items-center justify-center rounded-[var(--radius-card)] bg-white p-10 shadow-card hc-outline">
        <img
          src={stemSportsLogo}
          alt="STEM Sports"
          className="h-auto w-full max-w-[17.5rem] object-contain"
          loading="lazy"
          width={3615}
          height={1138}
        />
      </Reveal>
    </div>

    <Reveal>
      <blockquote className="m-0 mb-10 rounded-[var(--radius-card)] bg-terracotta p-10 text-ivory">
        <p className="m-0 font-display text-2xl font-medium leading-snug">
          Disability, Inclusion &amp; Accessibility — Special Education needs and the Special
          Teams Players programme.
        </p>
      </blockquote>
    </Reveal>

    <p className="m-0 mb-4 font-sans text-[0.9375rem] leading-[1.7] text-charcoal">
      Beneficiaries: school-age learners (Year 1–9 plus special education), NEET young people,
      and adults returning to education.
    </p>

    <LinkButton href={PARTNER_LINKS.stemSports} variant="tertiary" external>
      Visit stemsports.com
    </LinkButton>
  </section>
);
