import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StatusChip } from '@/components/ui/StatusChip';

const SLOTS = ['first', 'second', 'third'] as const;

export const Testimonials = () => (
  <section
    id="testimonials"
    aria-labelledby="testimonials-heading"
    className="mx-auto max-w-[80rem] px-6 pb-24 md:px-12"
  >
    <Reveal className="mb-12">
      <SectionHeading
        id="testimonials-heading"
        title="What people say"
        align="center"
      />
    </Reveal>

    <ul className="m-0 grid grid-cols-1 list-none gap-6 p-0 md:grid-cols-3">
      {SLOTS.map((slot) => (
        <li key={slot} className="contents">
          <Reveal className="rounded-[var(--radius-card)] bg-white p-8 shadow-card hc-outline">
            <StatusChip kind="coming-soon" className="mb-5" />
            <p className="m-0 font-sans text-[0.9375rem] leading-[1.7] text-warm-grey">
              Stories from people taking part in our programmes will be shared here.
            </p>
          </Reveal>
        </li>
      ))}
    </ul>
  </section>
);
