import thriveMark from '@/assets/images/thrive-forward-mark.png';
import thriveVideoPoster from '@/assets/images/thrive-forward-video-poster.jpg';
import poster from '@/assets/images/launchpad-digital-work-poster.jpg';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/Button';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { useWaitlistUiStore } from '@/stores/waitlistUiStore';
import { scrollToSection } from '@/utils/scrollToSection';
import type { ProgrammeId } from '@/features/waitlist';
import type { PathwayCard } from '../types';

/** Matches the captions in public/media/thrive-forward-guide.en.vtt. */
const TRANSCRIPT = [
  'How to use your Thrive Forward Guide. This guide was made for you. You can read it alone, with a mentor, or in a group.',
  'Two topics we cover: what is inside your guidebook, and how to use it to rebuild confidence and find work.',
  'Discussion points. Your skills matter. CV support. Interview practice. Wellbeing first. Peer mentoring, and digital skills and safety.',
  '“My qualifications are from another country. Can this still help me?” “I don’t have perfect English. Is this guide still for me?”',
  'Yes, this guide is built around your journey. It includes CV help for overseas qualifications, multilingual phrases, and support for every step.',
  '“I have been out of work for a long time. I don’t know how to explain the gap in my CV.”',
  'Possible approaches. Section 3 of the guide helps you frame employment gaps honestly and confidently for UK employers. LaunchPad (coming soon) includes AI interview practice, so you can build confidence before the real thing. Your peer mentor can help you tell your professional story.',
  'Your journey is your strength, not a weakness. Quick facts: available in Arabic, Somali, Tigrinya, Yoruba and French. Free on any phone, tablet, or printed copy.',
  'You are not starting from zero. You bring wisdom, strength, and great potential. Thrive Forward walks with you every step of the way.',
] as const;

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
  { name: 'RISE+', audience: 'Ages 9–17', programmeId: 'launchpad-rise-plus' },
  {
    name: 'Digital Work Ready',
    audience: 'Refugees and people seeking asylum',
    programmeId: 'launchpad-digital-work-ready',
  },
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
        <div className="mb-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading
                id="launchpad-heading"
                title="LaunchPad101"
              />
            </Reveal>

            <Reveal>
              <p className="m-0 mt-5 max-w-2xl font-sans text-base leading-[1.75] text-charcoal">
                An inclusive career preparation platform turning career gaps into an
                opportunity-focused narrative — AI interview practice, CV building, leadership
                development, and a NEET employability module. Six pathways, one platform.
              </p>
            </Reveal>

            {/* Thrive Forward is open now, unlike the six pathways, so it sits
                in the space beside the poster with its own download. */}
            <Reveal className="mt-10 flex flex-col gap-5">
              <article
                aria-labelledby="thrive-forward-heading"
                className="rounded-[var(--radius-card)] border-[1.5px] border-sand bg-white p-6 shadow-card hc-outline sm:p-8"
              >
                <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <img
                    src={thriveMark}
                    alt=""
                    width={240}
                    height={240}
                    loading="lazy"
                    className="size-20 shrink-0 sm:size-24"
                  />
                  <div>
                    <h3
                      id="thrive-forward-heading"
                      className="m-0 font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight text-terracotta"
                    >
                      Thrive Forward
                    </h3>
                    <p className="m-0 mt-1 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-charcoal">
                      Skills &amp; Wellness Navigator
                    </p>
                    <p className="m-0 mt-2 inline-block rounded-full bg-marigold px-3 py-0.5 font-sans text-xs font-bold tracking-[0.08em] text-charcoal">
                      2026
                    </p>
                  </div>
                </div>

                <div className="border-t-[3px] border-marigold pt-5">
                  <h4 className="m-0 mb-3 font-display text-lg font-semibold text-terracotta">
                    Evidence-Based Wellness Programme
                  </h4>
                  <p className="m-0 font-sans text-[0.9375rem] leading-relaxed text-charcoal">
                    This inclusive programme supports refugees through skills development and
                    wellness initiatives, helping participants build confidence, strengthen
                    capabilities, and pursue opportunities while promoting wellbeing, inclusion,
                    and meaningful participation in their communities.
                  </p>
                </div>
              </article>

              <DownloadLink
                href="/documents/thrive-forward-skills-navigator.pdf"
                label="Thrive Forward Skills Navigator"
                description="What the programme offers, who it is for, and how to join."
                meta="PDF, 444 KB"
              />

              {/* Self-hosted, so no third-party player or consent gate is
                  needed. preload="none" keeps the 5 MB file off the page load
                  until someone presses play. */}
              <figure className="m-0">
                <video
                  controls
                  preload="none"
                  playsInline
                  poster={thriveVideoPoster}
                  width={1280}
                  height={720}
                  aria-describedby="thrive-video-caption"
                  className="aspect-video w-full rounded-[var(--radius-card)] bg-charcoal shadow-card hc-outline"
                >
                  <source src="/media/thrive-forward-guide.mp4" type="video/mp4" />
                  <track
                    kind="captions"
                    src="/media/thrive-forward-guide.en.vtt"
                    srcLang="en"
                    label="English"
                    default
                  />
                  <a href="/media/thrive-forward-guide.mp4">Download the Thrive Forward guide video</a>
                </video>
                <figcaption
                  id="thrive-video-caption"
                  className="mt-3 font-sans text-[0.9375rem] leading-relaxed text-charcoal"
                >
                  <strong className="font-semibold">Watch: the Thrive Forward guide</strong> — what
                  is inside the guidebook, and how to use it to rebuild confidence and find work.
                  1 min 32 s. Captions are on by default.
                </figcaption>
                <details className="mt-3 rounded-xl border-[1.5px] border-sand bg-white px-4 py-3 font-sans text-[0.9375rem] leading-relaxed text-charcoal">
                  <summary className="cursor-pointer font-semibold">Read the transcript</summary>
                  <div className="mt-3 flex flex-col gap-3">
                    {TRANSCRIPT.map((line) => (
                      <p key={line} className="m-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </details>
              </figure>
            </Reveal>
          </div>

          {/* Supplied as a one-page PDF; shown as an image so it reads inline,
              with the PDF offered alongside. The poster's key text is
              summarised in the alt and repeated in the pathway cards below. */}
          <Reveal className="mx-auto flex w-full max-w-md flex-col gap-5 lg:max-w-none">
            <figure className="m-0">
              <img
                src={poster}
                alt="Digital Work Readiness Programme poster: Turn your skills into a career in the UK. Practical, hands-on training in interviews, teamwork, feedback and workplace confidence, for the Adult pathway, Thrive101, Veterans and spouses, and Digital Work Ready. Learn by doing through mock interviews, role play, team projects, workplace simulations and a personal action plan."
                className="w-full rounded-[var(--radius-card)] shadow-card hc-outline"
                loading="lazy"
                width={1100}
                height={1556}
              />
            </figure>
            <DownloadLink
              href="/documents/launchpad101-digital-work-readiness.pdf"
              label="Digital Work Readiness Programme poster"
              description="Who each pathway is for, how you learn, and who is eligible."
              meta="PDF, 590 KB"
            />
          </Reveal>
        </div>

        {/* Informational cards — not links, because there is nowhere to go yet.
            The single call to action sits below them instead. */}
        <ul className="m-0 mb-12 grid grid-cols-1 list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* RISE+ spans two distinct age bands with different offers, which the
            one-line pathway card above cannot carry. It gets its own panel
            as well as its card. */}
        <Reveal className="mb-12 rounded-[var(--radius-card)] bg-white p-8 shadow-card hc-outline sm:p-10">
          <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="m-0 font-display text-2xl font-semibold text-terracotta">
              The RISE+ Project
            </h3>
            <p className="m-0 font-sans text-sm text-warm-grey">
              with a{' '}
              <a
                href="#lift-project"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection('lift-project');
                }}
                className="font-medium text-terracotta underline underline-offset-4 hover:text-charcoal"
              >
                Lift Project
              </a>{' '}
              wraparound
            </p>
          </div>

          <p className="m-0 mb-7 max-w-2xl font-sans text-base leading-[1.7] text-charcoal">
            A resilience initiative supporting young people aged 9–17, guiding them from early
            belonging through to positive, hopeful futures.
          </p>

          <ul className="m-0 grid grid-cols-1 list-none gap-5 p-0 sm:grid-cols-2">
            <li className="rounded-[var(--radius-tile)] border-[1.5px] border-sand p-5">
              <p className="m-0 mb-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
                Ages 9–13
              </p>
              <p className="m-0 font-sans text-[0.9375rem] leading-relaxed text-charcoal">
                Gentle mentoring to build confidence and connection.
              </p>
            </li>
            <li className="rounded-[var(--radius-tile)] border-[1.5px] border-sand p-5">
              <p className="m-0 mb-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
                Ages 13–17
              </p>
              <p className="m-0 font-sans text-[0.9375rem] leading-relaxed text-charcoal">
                RISE+ supportive workshops nurturing resilience and hope.
              </p>
            </li>
          </ul>
        </Reveal>

        <Reveal className="flex flex-wrap items-center gap-4">
          <Button onClick={() => requestWaitlistFocus(PATHWAYS.map((p) => p.programmeId))}>
            Join the LaunchPad101 waitlist
          </Button>
          <p className="m-0 font-sans text-sm text-warm-grey">
            All six pathways will be ticked for you — untick any you do not want.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
