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
        adornment={<StatusChip kind="placeholder" />}
        align="center"
      />
    </Reveal>

    <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
      {SLOTS.map((slot) => (
        <li key={slot} className="contents">
          <Reveal className="rounded-[var(--radius-card)] bg-white p-8 shadow-card hc-outline">
            <p className="m-0 mb-6 font-sans text-[0.9375rem] italic leading-[1.7] text-warm-grey">
              &ldquo;Quote pending — to be collected from a programme participant.&rdquo;
            </p>
            <p className="m-0 font-sans text-sm font-semibold text-charcoal">Name</p>
            <p className="m-0 mt-0.5 font-sans text-[0.8125rem] text-warm-grey">
              Programme participant
            </p>
          </Reveal>
        </li>
      ))}
    </ul>
  </section>
);
