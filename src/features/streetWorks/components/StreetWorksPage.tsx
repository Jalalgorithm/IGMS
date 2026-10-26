import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Reveal } from '@/components/shared/Reveal';
import { LinkButton } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { ORG, SiteFooter, SiteHeader } from '@/features/landing';
import { cn } from '@/utils/classNames';
import { USE_MOCK, fetchBoard } from '../services/streetWorksApi';
import { TICK_LABELS, type BoardRow, type Period, type Tick } from '../types';

type Grouping = 'streets' | 'areas' | 'ticks';

const GROUPINGS: ReadonlyArray<{ id: Grouping; label: string }> = [
  { id: 'streets', label: 'Streets' },
  { id: 'areas', label: 'Areas' },
  { id: 'ticks', label: 'What happened' },
];

const PERIODS: ReadonlyArray<{ id: Period; label: string }> = [
  { id: '30', label: 'Last 30 days' },
  { id: 'all', label: 'All time' },
];

const HUMAN_COST = [
  'A disabled resident misses a job interview because the pavement is closed.',
  'A jobseeker arrives late to a Jobcentre appointment and loses benefits.',
  'An older person gives up their trip to the GP after a near miss.',
  'People go out less and feel cut off, while local shops lose customers.',
] as const;

const STEPS = [
  { title: 'You tick what happened', body: 'One question, a few tick boxes, your area. Anonymous and takes 30 seconds.' },
  { title: 'We rank hotspots by harm', body: 'Falls, missed work and isolation count most, so the worst streets for people rise to the top.' },
  { title: 'We brief Newham Council', body: 'Each month the top hotspots go to the council with the evidence and a clear request.' },
] as const;

const people = (n: number) => `${n} ${n === 1 ? 'person' : 'people'}`;

/** The plain-text brief IGMS sends to the council for one row of the board. */
const briefFor = (row: BoardRow, grouping: Grouping, period: Period): string => {
  const per = period === '30' ? 'in the last 30 days' : 'so far';
  const source = 'Source: IGMS CIC community street works reports (igms-cic.org).';
  if (grouping === 'ticks') {
    return `"${TICK_LABELS[row.name as Tick]}": reported by ${people(row.reports)} ${per}.\n\n${source}`;
  }
  const where = row.area ? `${row.name}, ${row.area}` : row.name;
  const c = row.counts;
  const lines = [`${where}: ${row.reports} anonymous ${row.reports === 1 ? 'report' : 'reports'} ${per}.`, '', 'Human cost:'];
  const harm: string[] = [];
  if (c.fall) harm.push(`- ${people(c.fall)} had a fall or near miss.`);
  if (c.missed) harm.push(`- ${people(c.missed)} were made late for or missed work, an interview or an appointment.`);
  if (c.isolated) harm.push(`- ${people(c.isolated)} now go out less or feel cut off.`);
  if (c.avoided) harm.push(`- ${people(c.avoided)} gave up a trip or needed someone's help.`);
  lines.push(...(harm.length ? harm : ['- No falls, missed appointments or lost trips reported yet.']));

  const problems = (['closed', 'surface', 'crossing', 'barriers', 'noise'] as const)
    .filter((tick) => c[tick] > 0)
    .sort((a, b) => c[b] - c[a])
    .slice(0, 2);
  if (problems.length) {
    lines.push('', `Main problems: ${problems.map((t) => `${TICK_LABELS[t].toLowerCase()} (${c[t]})`).join(', ')}.`);
  }
  if (c.nowarning) lines.push(`${people(c.nowarning)} said there was no warning before the works started.`);
  lines.push(
    '',
    `Request: please review the works at ${where}, ${c.fall ? 'make the walking route safe for disabled and older people, ' : ''}${c.nowarning ? 'give residents advance notice, ' : ''}and confirm when the pavement will be fully open.`,
    '',
    source,
  );
  return lines.join('\n');
};

const ToggleGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ id: T; label: string }>;
  value: T;
  onChange: (id: T) => void;
}) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {options.map((option) => (
      <button
        key={option.id}
        type="button"
        aria-pressed={value === option.id}
        onClick={() => onChange(option.id)}
        className={cn(
          'min-h-10 rounded-full border-[1.5px] px-4 font-sans text-sm transition-colors',
          value === option.id
            ? 'border-marigold bg-marigold font-semibold text-charcoal'
            : 'border-sand bg-ivory text-charcoal hover:border-warm-grey',
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const Board = () => {
  const [grouping, setGrouping] = useState<Grouping>('streets');
  const [period, setPeriod] = useState<Period>('30');
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState('');

  const { data, isPending, isError } = useQuery({
    queryKey: ['street-works', 'board', period],
    queryFn: () => fetchBoard(period),
    staleTime: 60_000,
  });

  const rows = data ? data[grouping] : [];
  const max = rows[0]?.harm || 1;
  const nameOf = (row: BoardRow) => (grouping === 'ticks' ? TICK_LABELS[row.name as Tick] : row.name);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied('Copied');
    } catch {
      setCopied('Copy did not work. Select the text and copy it instead.');
    }
  };

  const kpis = data
    ? [
        { value: data.totals.falls, label: 'falls or near misses', alert: true },
        { value: data.totals.missed, label: 'made late for or missed work or an appointment', alert: true },
        { value: data.totals.cutOff, label: 'went out less, gave up a trip or needed help', alert: true },
        { value: data.totals.reports, label: 'reports in total', alert: false },
      ]
    : [];

  return (
    <>
      {USE_MOCK ? (
        <p className="m-0 mt-6 rounded-[var(--radius-tile)] border-[1.5px] border-dashed border-marigold bg-marigold/10 px-4 py-3 font-sans text-sm text-charcoal">
          Demo mode: these are example reports, not real ones.
        </p>
      ) : null}
      {isError ? (
        <p role="alert" className="m-0 mt-6 rounded-[var(--radius-tile)] border-[1.5px] border-terracotta bg-terracotta/8 px-4 py-3 font-sans text-sm text-charcoal">
          The board couldn&rsquo;t load right now. Please try again later.
        </p>
      ) : null}

      <dl aria-live="polite" className="m-0 mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex flex-col-reverse rounded-[var(--radius-tile)] bg-white px-5 py-4 shadow-card hc-outline">
            <dt className="font-sans text-sm text-charcoal/80">{kpi.label}</dt>
            <dd className={cn('m-0 font-display text-[2rem] font-semibold leading-tight tabular-nums', kpi.alert ? 'text-terracotta' : 'text-charcoal')}>
              {kpi.value}
            </dd>
          </div>
        ))}
      </dl>

      <div id="board" className="mt-6 rounded-[var(--radius-card)] bg-white p-5 shadow-card hc-outline sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-terracotta">
              Ranked by harm to people
            </p>
            <h3 className="m-0 mt-1 font-display text-2xl font-semibold text-charcoal">Hotspot board</h3>
          </div>
          <ToggleGroup label="Group by" options={GROUPINGS} value={grouping} onChange={(id) => { setGrouping(id); setOpen(null); }} />
        </div>
        <div className="mt-3">
          <ToggleGroup label="Time period" options={PERIODS} value={period} onChange={(id) => { setPeriod(id); setOpen(null); }} />
        </div>

        {isPending ? (
          <p className="m-0 mt-6 font-sans text-sm text-warm-grey">Loading the board…</p>
        ) : rows.length === 0 ? (
          <p className="m-0 mt-5 rounded-[var(--radius-tile)] border-[1.5px] border-dashed border-sand px-6 py-8 text-center font-sans text-sm text-warm-grey">
            No reports yet for this period.{' '}
            <Link to="/report-street-works" className="font-semibold text-terracotta underline underline-offset-2">
              Be the first to report
            </Link>
            .
          </p>
        ) : (
          <ol className="m-0 mt-5 grid list-none gap-2 p-0">
            {rows.map((row, index) => {
              const key = `${grouping}:${row.name}:${row.area ?? ''}`;
              const isOpen = open === key;
              const cutOff = row.counts.isolated + row.counts.avoided;
              return (
                <li key={key} className={cn('rounded-[var(--radius-tile)] border-[1.5px] bg-white', isOpen ? 'border-terracotta' : 'border-sand/70')}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => { setOpen(isOpen ? null : key); setCopied(''); }}
                    className="grid w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--radius-tile)] px-4 py-3 text-left"
                  >
                    <span className={cn('text-center font-display text-xl font-semibold', index < 3 ? 'text-terracotta' : 'text-warm-grey')}>
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="font-sans text-[0.9375rem] font-semibold text-charcoal [overflow-wrap:anywhere]">{nameOf(row)}</span>
                      {row.area ? <span className="font-sans text-sm text-warm-grey"> · {row.area}</span> : null}
                      <span className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-sand bg-ivory px-2 py-0.5 font-sans text-xs text-charcoal">
                          {row.reports} {row.reports === 1 ? 'report' : 'reports'}
                        </span>
                        {grouping !== 'ticks' && row.counts.fall ? (
                          <span className="rounded-full border border-terracotta bg-terracotta/10 px-2 py-0.5 font-sans text-xs text-charcoal">
                            {row.counts.fall} fall or near miss
                          </span>
                        ) : null}
                        {grouping !== 'ticks' && row.counts.missed ? (
                          <span className="rounded-full border border-marigold bg-marigold/15 px-2 py-0.5 font-sans text-xs text-charcoal">
                            {row.counts.missed} missed work or appointment
                          </span>
                        ) : null}
                        {grouping !== 'ticks' && cutOff ? (
                          <span className="rounded-full border border-marigold bg-marigold/15 px-2 py-0.5 font-sans text-xs text-charcoal">
                            {cutOff} cut off
                          </span>
                        ) : null}
                      </span>
                      <span aria-hidden="true" className="mt-2 block h-2 overflow-hidden rounded bg-sand/30">
                        <span className="block h-full bg-marigold" style={{ width: `${Math.max(4, (100 * row.harm) / max)}%` }} />
                      </span>
                    </span>
                    <span className="text-right tabular-nums">
                      <span className="block font-display text-xl font-semibold leading-none text-charcoal">{row.harm}</span>
                      <span className="font-sans text-[0.6875rem] uppercase tracking-[0.08em] text-warm-grey">harm</span>
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="grid gap-3 border-t-[1.5px] border-dashed border-sand px-4 py-4">
                      <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-terracotta">
                        Brief for the council{USE_MOCK ? ' (example)' : ''}
                      </p>
                      <pre className="m-0 whitespace-pre-wrap rounded-xl bg-ivory p-4 font-sans text-sm leading-relaxed text-charcoal [overflow-wrap:anywhere]">
                        {briefFor(row, grouping, period)}
                      </pre>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => void copy(briefFor(row, grouping, period))}
                          className="min-h-10 rounded-full border-[1.5px] border-terracotta px-4 font-sans text-sm font-semibold text-terracotta hover:bg-terracotta hover:text-ivory"
                        >
                          Copy brief
                        </button>
                        <span role="status" className="font-sans text-sm text-warm-grey">{copied}</span>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
        <p className="m-0 mt-4 font-sans text-[0.8125rem] leading-relaxed text-warm-grey">
          Harm points per tick: a fall or near miss 5, missed work or an appointment 4, going out less,
          giving up a trip or needing help 3, any other problem 1. A street is only named once several
          people have reported it. Tap a row to see the brief we send to the council.
        </p>
      </div>
    </>
  );
};

export const StreetWorksPage = () => {
  useEffect(() => {
    document.title = 'Newham Street Works — IGMS';
  }, []);

  return (
    <div className="mx-auto max-w-[100rem] bg-ivory">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <section aria-labelledby="sw-hero" className="bg-[radial-gradient(120%_90%_at_100%_0%,rgb(245_166_35/0.16),transparent_60%)] px-6 pb-20 pt-16 md:px-12">
          <Reveal className="mx-auto max-w-[80rem]">
            <p className="m-0 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-terracotta">
              Featured project · Newham
            </p>
            <h1 id="sw-hero" className="m-0 mt-3 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] text-charcoal">
              Street works don&rsquo;t just block pavements. They block lives.
            </h1>
            <p className="m-0 mt-5 max-w-2xl font-sans text-[clamp(1rem,1.4vw,1.1875rem)] leading-relaxed text-charcoal/85">
              Councils already hear about holes and barriers. They rarely hear who fell, who missed a
              Jobcentre appointment, or who stopped going out. Tell us what happened to you.
              It&rsquo;s anonymous and takes 30 seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/report-street-works"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-4 font-sans text-base font-semibold text-ivory no-underline hover:bg-terracotta-dark"
              >
                Report street works <span aria-hidden="true">&rarr;</span>
              </Link>
              <LinkButton href="#reporting" variant="secondary" size="lg">
                See the hotspot board
              </LinkButton>
            </div>
          </Reveal>
        </section>

        <section aria-labelledby="sw-about" className="px-6 py-24 md:px-12">
          <div className="mx-auto grid max-w-[80rem] grid-cols-1 items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <p className="m-0 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-terracotta">About this project</p>
              <h2 id="sw-about" className="m-0 mt-3 font-display text-[clamp(1.5rem,3vw,2.125rem)] font-semibold leading-tight text-terracotta">
                Street works are treated as an engineering problem. For many residents, they&rsquo;re a
                barrier to work, health and independence.
              </h2>
              <p className="m-0 mt-5 font-sans text-base leading-[1.75] text-charcoal">
                A closed pavement or a missing crossing can mean a disabled resident misses a job
                interview, an older person gives up their trip to the GP, or a jobseeker is sanctioned
                for arriving late to a Jobcentre appointment. Over time, people stop applying for jobs on
                routes they can&rsquo;t trust, go out less and become isolated, while nearby high street
                shops lose the customers who can no longer reach them.
              </p>
              <p className="m-0 mt-4 font-sans text-base leading-[1.75] text-charcoal">
                Councils and utility companies record where works happen and how long they last, but
                almost no one records what they cost the people living around them. Working with
                community researchers who have lived experience, IGMS CIC gathers anonymous reports of
                falls, missed appointments, lost work and isolation, and turns them into evidence the
                council can act on.
              </p>
              <ul aria-label="Where this project sits" className="m-0 mt-6 flex list-none flex-wrap gap-2.5 p-0">
                {['Transport', 'Disability and access', 'Employability', 'Wellbeing', 'Local economy'].map((tag) => (
                  <li key={tag}><Tag>{tag}</Tag></li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="rounded-[var(--radius-card)] border-l-4 border-terracotta bg-white p-7 shadow-card hc-outline">
              <h3 className="m-0 mb-4 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-terracotta">
                The human cost nobody records
              </h3>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {HUMAN_COST.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-sans text-[0.9375rem] leading-relaxed text-charcoal">
                    <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-terracotta" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="sw-how" className="bg-terracotta/8 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-[80rem]">
            <Reveal>
              <p className="m-0 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-terracotta">How it works</p>
              <h2 id="sw-how" className="m-0 mt-3 font-display text-[clamp(1.5rem,3vw,2.125rem)] font-semibold text-terracotta">
                From one tick to a brief on the council&rsquo;s desk
              </h2>
            </Reveal>
            <ol className="m-0 mt-8 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="contents">
                  <Reveal className="rounded-[var(--radius-card)] bg-white p-6 shadow-card hc-outline">
                    <span aria-hidden="true" className="mb-3 flex size-9 items-center justify-center rounded-full bg-marigold font-display font-semibold text-charcoal">
                      {index + 1}
                    </span>
                    <h3 className="m-0 font-sans text-base font-semibold text-charcoal">{step.title}</h3>
                    <p className="m-0 mt-1 font-sans text-sm leading-relaxed text-charcoal/80">{step.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="reporting" aria-labelledby="sw-board" className="px-6 py-24 md:px-12">
          <div className="mx-auto max-w-[80rem]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="m-0 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-terracotta">What people are reporting</p>
                <h2 id="sw-board" className="m-0 mt-3 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold text-terracotta">
                  Where street works hurt most
                </h2>
              </div>
              <Link
                to="/report-street-works"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-sans text-[0.9375rem] font-semibold text-ivory no-underline hover:bg-terracotta-dark"
              >
                Report street works <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <Board />
          </div>
        </section>

        <section aria-label="Help and privacy" className="bg-marigold/10 px-6 py-20 md:px-12">
          <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h2 className="m-0 font-display text-2xl font-semibold text-terracotta">Can&rsquo;t use the form?</h2>
              <p className="m-0 mt-3 font-sans text-base leading-relaxed text-charcoal">
                Our community researchers can fill it in with you, in person, with large print or read
                aloud. A carer or support worker can also{' '}
                <Link to="/report-street-works" className="font-semibold text-terracotta underline underline-offset-4">report for you</Link>.
              </p>
            </div>
            <div>
              <h2 className="m-0 font-display text-2xl font-semibold text-terracotta">How we use your report</h2>
              <p className="m-0 mt-3 font-sans text-base leading-relaxed text-charcoal">
                Reports are added up by street and area. Each month IGMS sends the top hotspots to
                Newham Council with the numbers on this page. We never publish anything that could
                identify you.
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Contact IGMS" className="px-6 py-16 md:px-12">
          <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-[var(--radius-card)] border-[1.5px] border-sand bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:pl-8 sm:pr-3">
            <div>
              <h2 className="m-0 font-display text-lg font-semibold text-terracotta">Council, funder or partner?</h2>
              <p className="m-0 font-sans text-sm text-charcoal/80">
                Email us to pilot this in your borough, fund it, or get the data —{' '}
                <span className="select-all font-medium text-charcoal">{ORG.email}</span>
              </p>
            </div>
            <LinkButton href={`mailto:${ORG.email}?subject=${encodeURIComponent('Newham street works')}`} className="shrink-0 self-start sm:self-center">
              Email us
            </LinkButton>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};
