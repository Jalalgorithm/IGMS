import { Reveal } from '@/components/shared/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { StatusChip } from '@/components/ui/StatusChip';
import { Tag } from '@/components/ui/Tag';

const FACTS = ['No login or account', 'Nothing saved', 'Free', 'Text or voice input'] as const;

export const EasyAsk = () => (
  <section
    id="easyask"
    aria-labelledby="easyask-heading"
    className="mx-auto grid max-w-[80rem] items-center gap-16 px-6 py-24 md:px-12 lg:grid-cols-2 lg:gap-[4.5rem]"
  >
    <Reveal>
      <SectionHeading
        id="easyask-heading"
        title="EasyAsk"
        adornment={<StatusChip kind="description-only" />}
      />

      <p className="m-0 mb-5 mt-5 font-sans text-base leading-[1.75] text-charcoal">
        A self-advocacy tool that helps someone put into words what they need when asking for
        support — at work, with a doctor, at school, or arranging transport.
      </p>

      <p className="m-0 mb-5 font-sans text-[0.9375rem] leading-[1.7] text-charcoal">
        Two questions — what is making things hard, and what would help — turned into a short,
        shareable note. Text or voice input.
      </p>

      <p className="m-0 mb-6 font-sans text-sm leading-relaxed text-warm-grey">
        Languages: English now; Bengali, Urdu, Somali and Polish coming soon.
      </p>

      <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
        {FACTS.map((fact) => (
          <li key={fact}>
            <Tag tone="outline">{fact}</Tag>
          </li>
        ))}
      </ul>
    </Reveal>

    {/* A worked example rather than a mock interface — the chip above says
        this is a description, and a fake input would contradict it. */}
    <Reveal className="rounded-[var(--radius-card)] bg-charcoal p-10 text-ivory">
      <p className="m-0 mb-4 font-sans text-[0.8125rem] text-ivory/60">
        &ldquo;What is making things hard?&rdquo;
      </p>
      <p className="m-0 mb-7 font-display text-[1.0625rem] font-medium leading-snug text-marigold">
        Getting to appointments — the bus stop is too far and there is nowhere to sit.
      </p>

      <p className="m-0 mb-4 font-sans text-[0.8125rem] text-ivory/60">
        &ldquo;What would help?&rdquo;
      </p>
      <p className="m-0 font-display text-[1.0625rem] font-medium leading-snug text-marigold">
        A closer pickup point, or someone to call ahead for me.
      </p>
    </Reveal>
  </section>
);
