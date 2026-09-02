import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SiteFooter, SiteHeader } from '@/features/landing';
import { NotFound } from '@/routes/NotFound';
import { getPolicy, POLICIES, policyPath } from '../policies';
import type { PolicySlug } from '../types';
import { PolicyEmbed } from './PolicyEmbed';

export const PolicyPage = () => {
  const { slug } = useParams<{ slug: PolicySlug }>();
  const policy = slug ? getPolicy(slug) : undefined;

  useEffect(() => {
    if (!policy) return;
    const previous = document.title;
    document.title = `${policy.title} — IGMS`;
    window.scrollTo({ top: 0, behavior: 'auto' });
    return () => {
      document.title = previous;
    };
  }, [policy]);

  if (!policy) return <NotFound />;

  return (
    <div className="mx-auto max-w-[100rem] bg-ivory">
      <SiteHeader />

      <main id="main" tabIndex={-1} className="mx-auto max-w-4xl px-6 py-20 md:px-12">
        <p className="m-0 mb-3 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-terracotta">
          Legal
        </p>
        <h1 className="m-0 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-terracotta">
          {policy.title}
        </h1>
        <p className="m-0 mb-10 mt-4 max-w-2xl font-sans text-[1.0625rem] leading-relaxed text-charcoal">
          {policy.summary}
        </p>

        <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-card hc-outline sm:p-10">
          <PolicyEmbed embedId={policy.embedId} title={policy.title} />
        </div>

        <nav aria-label="Other policies" className="mt-12 border-t border-sand pt-8">
          <p className="m-0 mb-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
            Other policies
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
            {POLICIES.filter((other) => other.slug !== policy.slug).map((other) => (
              <li key={other.slug}>
                <Link
                  to={policyPath(other.slug)}
                  className="font-sans text-sm font-medium text-terracotta underline underline-offset-4 hover:text-charcoal"
                >
                  {other.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
};
