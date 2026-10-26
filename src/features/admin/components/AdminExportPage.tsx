import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import mark from '@/assets/brand/igms-mark.png';
import type { ApiErrorShape } from '@/types';
import { USE_MOCK, downloadExport, verifyPassword, type Dataset } from '../services/exportsApi';

const DATASETS: ReadonlyArray<{ id: Dataset; title: string; description: string }> = [
  {
    id: 'waitlist',
    title: 'Waitlist',
    description: 'Everyone who has joined, with their programmes and contact preferences.',
  },
  {
    id: 'street-works',
    title: 'Street works reports',
    description: 'Every anonymous Newham report, with area, street and what happened.',
  },
];

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-ivory px-5 py-10 sm:px-6">
    <main id="main" tabIndex={-1} className="mx-auto max-w-xl focus:outline-none">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 font-sans text-sm font-semibold text-terracotta no-underline">
        <img src={mark} alt="" aria-hidden="true" className="h-8 w-auto" />
        IGMS CIC
      </Link>
      {children}
    </main>
  </div>
);

/** Step 1: the password, checked by the server before anything else shows. */
const SignIn = ({ onSignedIn }: { onSignedIn: (password: string) => void }) => {
  const passwordId = useId();
  const errorId = useId();
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password) {
      setError('Enter the password.');
      return;
    }
    setChecking(true);
    setError('');
    try {
      await verifyPassword(password);
      onSignedIn(password);
    } catch (failure) {
      setError((failure as ApiErrorShape).message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <Shell>
      <h1 className="m-0 font-display text-3xl font-semibold text-charcoal">Staff sign in</h1>
      <p className="m-0 mt-2 font-sans text-base text-charcoal/80">
        Enter the staff password to get the latest data.
      </p>
      {USE_MOCK ? (
        <p className="m-0 mt-5 rounded-[var(--radius-tile)] border-[1.5px] border-dashed border-marigold bg-marigold/10 px-4 py-3 font-sans text-sm text-charcoal">
          This build uses demo data, so downloads are switched off.
        </p>
      ) : null}

      <form onSubmit={submit} noValidate className="mt-8 rounded-[var(--radius-card)] bg-white p-6 shadow-card hc-outline">
        <label htmlFor={passwordId} className="mb-2 block font-sans text-sm font-semibold text-charcoal">
          Password
        </label>
        <input
          id={passwordId}
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 font-sans text-base text-charcoal ${error ? 'border-terracotta' : 'border-sand hover:border-warm-grey'}`}
        />
        {error ? (
          <p id={errorId} role="alert" className="m-0 mt-2 font-sans text-sm font-medium text-terracotta">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={checking}
          className="mt-5 w-full rounded-full bg-terracotta px-6 py-3 font-sans text-[0.9375rem] font-semibold text-ivory hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? 'Checking…' : 'Continue'}
        </button>
      </form>
    </Shell>
  );
};

/** Step 2: the downloads. The password lives only in memory, for this visit. */
const Downloads = ({ password, onSignOut }: { password: string; onSignOut: (message?: string) => void }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [busy, setBusy] = useState<Dataset | null>(null);
  const [message, setMessage] = useState<{ tone: 'error' | 'ok'; text: string } | null>(null);

  useEffect(() => headingRef.current?.focus(), []);

  const download = async (dataset: Dataset) => {
    setBusy(dataset);
    setMessage(null);
    try {
      await downloadExport(dataset, password);
      setMessage({ tone: 'ok', text: 'Downloaded. The file holds personal data: keep it safe and delete it when you are done.' });
    } catch (failure) {
      const error = failure as ApiErrorShape;
      // The password was changed on the server since signing in.
      if (error.status === 401) onSignOut(error.message);
      else setMessage({ tone: 'error', text: error.message });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 ref={headingRef} tabIndex={-1} className="m-0 font-display text-3xl font-semibold text-charcoal focus:outline-none">
            Downloads
          </h1>
          <p className="m-0 mt-2 font-sans text-base text-charcoal/80">
            The latest data as spreadsheets. They open in Excel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSignOut()}
          className="rounded-full border-[1.5px] border-charcoal px-4 py-2 font-sans text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-ivory"
        >
          Sign out
        </button>
      </div>

      <ul className="m-0 mt-8 grid list-none gap-4 p-0">
        {DATASETS.map((dataset) => (
          <li
            key={dataset.id}
            className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-white p-6 shadow-card hc-outline sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="m-0 font-display text-xl font-semibold text-charcoal">{dataset.title}</h2>
              <p className="m-0 mt-1 font-sans text-sm text-charcoal/75">{dataset.description}</p>
            </div>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void download(dataset.id)}
              className="shrink-0 rounded-full bg-terracotta px-5 py-2.5 font-sans text-sm font-semibold text-ivory hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === dataset.id ? 'Preparing…' : 'Download'}
              <span className="sr-only"> {dataset.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <p
        role={message?.tone === 'error' ? 'alert' : 'status'}
        className={`m-0 mt-4 min-h-6 font-sans text-sm ${message?.tone === 'error' ? 'font-medium text-terracotta' : 'text-charcoal'}`}
      >
        {message?.text}
      </p>
    </Shell>
  );
};

/**
 * Staff-only spreadsheet downloads: sign in, then download. Not linked from
 * anywhere on the site and kept out of search engines. The password is held
 * in memory only — closing or refreshing the page signs you out.
 */
export const AdminExportPage = () => {
  const [password, setPassword] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | undefined>();

  useEffect(() => {
    document.title = 'Staff downloads — IGMS';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  if (password) {
    return (
      <Downloads
        password={password}
        onSignOut={(message) => {
          setPassword(null);
          setNotice(message);
        }}
      />
    );
  }
  return (
    <>
      {notice ? (
        <p role="alert" className="m-0 bg-terracotta/10 px-5 py-3 text-center font-sans text-sm font-medium text-charcoal">
          {notice}
        </p>
      ) : null}
      <SignIn onSignedIn={(value) => { setNotice(undefined); setPassword(value); }} />
    </>
  );
};
