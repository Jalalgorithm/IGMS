import inclusiveTeam from '@/assets/images/disability-inclusive-team.jpg';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Tag } from '@/components/ui/Tag';

const TAGS = [
  'Street works & transport access solutions',
  'Assistive technology',
  'Reasonable adjustment tooling',
  'Disabled adults & children',
] as const;

export const DisabilityAccess = () => (
  <section
    id="disability-access"
    aria-labelledby="disability-access-heading"
    className="mx-auto grid max-w-[80rem] items-center gap-16 px-6 pb-32 md:px-12 lg:grid-cols-2 lg:gap-[4.5rem]"
  >
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

      <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
        {TAGS.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>
    </Reveal>
  </section>
);
