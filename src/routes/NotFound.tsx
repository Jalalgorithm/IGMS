import { Link } from 'react-router-dom';

export const NotFound = () => (
  <main
    id="main"
    className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-6 px-6"
  >
    <p className="m-0 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-terracotta">
      Page not found
    </p>
    <h1 className="m-0 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-terracotta">
      That page is not here.
    </h1>
    <p className="m-0 font-sans text-base leading-relaxed text-charcoal">
      The link may be out of date, or the page may have moved. Everything IGMS publishes is
      on the main page.
    </p>
    <Link
      to="/"
      className="inline-flex items-center rounded-full bg-terracotta px-6 py-3 font-sans text-[0.9375rem] font-semibold text-ivory no-underline hover:bg-terracotta-dark"
    >
      Back to the homepage
    </Link>
  </main>
);
