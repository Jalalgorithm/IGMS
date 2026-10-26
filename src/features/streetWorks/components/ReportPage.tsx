import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import mark from '@/assets/brand/igms-mark.png';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import type { ApiErrorShape } from '@/types';
import { cn } from '@/utils/classNames';
import { USE_MOCK, submitReport } from '../services/streetWorksApi';
import {
  AREAS,
  HARM_TICKS,
  PROBLEM_TICKS,
  TICK_QUESTIONS,
  type Area,
  type ReportedBy,
  type Tick,
} from '../types';

const AREA_LABEL = (area: Area) => (area === 'Other' ? 'Somewhere else in Newham' : area);

interface ErrorItem {
  targetId: string;
  message: string;
}

/**
 * The anonymous report form. Deliberately alone on its page: no header
 * navigation, no footer, nothing to distract from three questions. Large type
 * and large tick targets throughout; the site's own text-size setting is the
 * "Bigger text" button, so the choice carries over to every other page.
 */
export const ReportPage = () => {
  const textSize = useAccessibilityStore((state) => state.textSize);
  const setTextSize = useAccessibilityStore((state) => state.setTextSize);
  const bigger = textSize !== 'normal';

  const [ticks, setTicks] = useState<Tick[]>([]);
  const [area, setArea] = useState<Area | ''>('');
  const [street, setStreet] = useState('');
  const [by, setBy] = useState<ReportedBy>('self');
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = 'Report street works — IGMS Newham';
  }, []);

  useEffect(() => {
    if (errors.length) summaryRef.current?.focus();
  }, [errors]);

  useEffect(() => {
    if (sent) {
      window.scrollTo({ top: 0 });
      thanksRef.current?.focus();
    }
  }, [sent]);

  const toggleTick = (tick: Tick) =>
    setTicks((current) => (current.includes(tick) ? current.filter((t) => t !== tick) : [...current, tick]));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: ErrorItem[] = [];
    if (!ticks.length) found.push({ targetId: 'tick-fall', message: 'Question 1: tick at least one box' });
    if (!area) found.push({ targetId: 'area', message: 'Question 2: choose an area' });
    setErrors(found);
    if (found.length || !area) return;

    setSending(true);
    try {
      await submitReport({
        ticks,
        area,
        by,
        ...(street.trim() ? { street: street.trim() } : {}),
        ...(website ? { website } : {}),
      });
      setSent(true);
    } catch (error) {
      const apiError = error as ApiErrorShape;
      setErrors([
        {
          targetId: 'send',
          message:
            apiError.status === 429
              ? 'Too many reports from this connection. Please try again in an hour.'
              : "Your report didn't send. Check your internet connection and try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const startAgain = () => {
    setTicks([]);
    setArea('');
    setStreet('');
    setBy('self');
    setErrors([]);
    setSent(false);
    window.requestAnimationFrame(() => titleRef.current?.focus());
  };

  const tickBox = (tick: Tick) => (
    <label
      key={tick}
      htmlFor={`tick-${tick}`}
      className={cn(
        'flex min-h-16 cursor-pointer items-center gap-4 rounded-[var(--radius-tile)] border-2 bg-white px-4 py-3.5 font-sans text-[1.0625rem] font-medium leading-snug text-charcoal transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-charcoal hc-outline',
        ticks.includes(tick) ? 'border-terracotta bg-terracotta/5' : 'border-sand hover:border-warm-grey',
      )}
    >
      <input
        type="checkbox"
        id={`tick-${tick}`}
        name="ticks"
        value={tick}
        checked={ticks.includes(tick)}
        onChange={() => toggleTick(tick)}
        className="size-7 shrink-0 cursor-pointer accent-[var(--color-terracotta)] focus:outline-none"
      />
      {TICK_QUESTIONS[tick]}
    </label>
  );

  const control =
    'min-h-15 w-full rounded-[var(--radius-tile)] border-2 bg-white px-4 py-3.5 font-sans text-[1.0625rem] text-charcoal';

  return (
    <div className="min-h-screen bg-ivory">
      <div className="mx-auto max-w-2xl px-5 pb-16 pt-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/street-works" className="flex items-center gap-2 font-sans text-sm font-semibold text-terracotta no-underline">
            <img src={mark} alt="" aria-hidden="true" className="h-8 w-auto" />
            IGMS CIC · Newham
          </Link>
          <button
            type="button"
            aria-pressed={bigger}
            onClick={() => setTextSize(bigger ? 'normal' : 'large')}
            className="min-h-11 rounded-full border-2 border-charcoal bg-white px-4 font-sans text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-ivory"
          >
            {bigger ? 'Normal text' : 'Bigger text'}
          </button>
        </div>

        <main id="main" tabIndex={-1} className="focus:outline-none">
          {sent ? (
            <div
              ref={thanksRef}
              tabIndex={-1}
              aria-labelledby="thanks-heading"
              className="mt-10 rounded-[var(--radius-card)] border-[3px] border-[#17663f] bg-white p-7 focus:outline-none"
            >
              <h1 id="thanks-heading" className="m-0 font-display text-[1.75rem] font-semibold leading-tight text-[#17663f]">
                Thank you. Your report has been sent.
              </h1>
              <p className="m-0 mt-3 font-sans text-[1.0625rem] leading-relaxed text-charcoal">
                It will go into our next report to Newham Council, so they can see what street works
                are costing people.
              </p>
              {USE_MOCK ? (
                <p className="m-0 mt-3 font-sans text-sm text-warm-grey">Demo mode: nothing was saved.</p>
              ) : null}
              <div className="mt-6 grid gap-3">
                <Link
                  to="/street-works"
                  className="flex min-h-15 items-center justify-center rounded-full bg-terracotta px-6 font-sans text-base font-semibold text-ivory no-underline hover:bg-terracotta-dark"
                >
                  See what other people reported
                </Link>
                <button
                  type="button"
                  onClick={startAgain}
                  className="min-h-15 rounded-full border-2 border-charcoal bg-white px-6 font-sans text-base font-semibold text-charcoal hover:bg-charcoal hover:text-ivory"
                >
                  Send another report
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1
                ref={titleRef}
                tabIndex={-1}
                id="report-heading"
                className="m-0 mt-8 font-display text-[clamp(1.75rem,6vw,2.375rem)] font-semibold leading-tight text-terracotta focus:outline-none"
              >
                Tell us how street works affected you
              </h1>
              <p className="m-0 mt-3 font-sans text-[1.0625rem] text-charcoal">
                3 short questions. It takes about 30 seconds.
              </p>
              <p className="m-0 mt-4 rounded-[var(--radius-tile)] border-2 border-sand bg-white px-5 py-4 font-sans text-base text-charcoal">
                <strong className="font-semibold">You stay anonymous.</strong> We don&rsquo;t ask for
                your name, email or phone number.
              </p>
              {USE_MOCK ? (
                <p className="m-0 mt-3 rounded-[var(--radius-tile)] border-2 border-dashed border-marigold bg-marigold/10 px-4 py-3 font-sans text-sm text-charcoal">
                  Demo mode: this report will not be saved.
                </p>
              ) : null}

              <form onSubmit={handleSubmit} noValidate aria-labelledby="report-heading" className="mt-8 grid gap-9">
                {errors.length ? (
                  <div
                    ref={summaryRef}
                    tabIndex={-1}
                    role="alert"
                    className="rounded-[var(--radius-tile)] border-[3px] border-[#a3211a] bg-white px-5 py-4 focus:outline-none"
                  >
                    <p className="m-0 mb-2 font-sans text-base font-semibold text-[#a3211a]">Please check:</p>
                    <ul className="m-0 pl-5">
                      {errors.map((item) => (
                        <li key={item.targetId} className="font-sans text-base">
                          <a
                            href={`#${item.targetId}`}
                            onClick={(event) => {
                              event.preventDefault();
                              document.getElementById(item.targetId)?.focus();
                            }}
                            className="font-semibold text-[#a3211a] underline underline-offset-2"
                          >
                            {item.message}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <fieldset className="m-0 min-w-0 border-0 p-0" aria-describedby="q1-hint">
                  <legend className="mb-1 p-0">
                    <span className="block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-terracotta">
                      Question 1 of 3
                    </span>
                    <span className="block font-display text-[1.375rem] font-semibold leading-snug text-charcoal">
                      What worried you most, or caused the most trouble?
                    </span>
                  </legend>
                  <p id="q1-hint" className="m-0 mb-4 font-sans text-base text-charcoal/80">
                    Tick one or more.
                  </p>
                  <div className="grid gap-2.5">
                    {HARM_TICKS.map(tickBox)}
                    {PROBLEM_TICKS.map(tickBox)}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="area" className="mb-3 block">
                    <span className="block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-terracotta">
                      Question 2 of 3
                    </span>
                    <span className="block font-display text-[1.375rem] font-semibold leading-snug text-charcoal">
                      Which area of Newham?
                    </span>
                  </label>
                  <select
                    id="area"
                    value={area}
                    onChange={(event) => setArea(event.target.value as Area | '')}
                    aria-invalid={errors.some((e) => e.targetId === 'area') || undefined}
                    className={cn(control, errors.some((e) => e.targetId === 'area') ? 'border-[#a3211a]' : 'border-sand')}
                  >
                    <option value="">Choose an area</option>
                    {AREAS.map((option) => (
                      <option key={option} value={option}>
                        {AREA_LABEL(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="street" className="mb-1 block">
                    <span className="block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-terracotta">
                      Question 3 of 3
                    </span>
                    <span className="block font-display text-[1.375rem] font-semibold leading-snug text-charcoal">
                      Which street?{' '}
                      <span className="font-sans text-base font-normal text-charcoal/70">(you can skip this)</span>
                    </span>
                  </label>
                  <p id="street-hint" className="m-0 mb-3 font-sans text-base text-charcoal/80">
                    Or a place nearby, like a shop or bus stop. Please don&rsquo;t include a house number.
                  </p>
                  <input
                    id="street"
                    type="text"
                    maxLength={60}
                    autoComplete="off"
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    aria-describedby="street-hint"
                    className={cn(control, 'border-sand')}
                  />
                </div>

                <div>
                  <label htmlFor="by" className="mb-3 block font-sans text-base font-semibold text-charcoal">
                    Who is filling this in?{' '}
                    <span className="font-normal text-charcoal/70">(you can skip this)</span>
                  </label>
                  <select
                    id="by"
                    value={by}
                    onChange={(event) => setBy(event.target.value as ReportedBy)}
                    className={cn(control, 'border-sand')}
                  >
                    <option value="self">Me, for myself</option>
                    <option value="support">Me, for someone I support</option>
                    <option value="researcher">An IGMS community researcher</option>
                  </select>
                </div>

                {/* Bot trap: invisible to people and to screen readers. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="website">Leave this empty</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>

                <button
                  id="send"
                  type="submit"
                  disabled={sending}
                  className="min-h-16 w-full rounded-full bg-terracotta px-7 font-sans text-[1.125rem] font-semibold text-ivory hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? 'Sending…' : 'Send my report'}
                </button>
              </form>

              <section aria-labelledby="help-heading" className="mt-10 border-t-2 border-sand pt-6">
                <h2 id="help-heading" className="m-0 font-display text-xl font-semibold text-charcoal">
                  Need help?
                </h2>
                <p className="m-0 mt-2 font-sans text-base leading-relaxed text-charcoal">
                  A carer, family member or support worker can fill this in for you. Our community
                  researchers can also do it with you in person, in large print or read aloud.
                </p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
