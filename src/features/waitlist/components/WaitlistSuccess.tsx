import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { formatDateTime } from '@/utils/formatDate';
import { getProgrammeName } from '../services/programmes';
import type { WaitlistEntry } from '../types';

interface WaitlistSuccessProps {
  entry: WaitlistEntry;
  onAddAnother: () => void;
}

export const WaitlistSuccess = ({ entry, onAddAnother }: WaitlistSuccessProps) => (
  <div
    className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-white p-8 shadow-card hc-outline sm:p-10"
    role="status"
    aria-live="polite"
  >
    <div className="flex items-start gap-4">
      <span
        aria-hidden="true"
        className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-marigold text-charcoal"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none">
          <path
            d="m5 12.5 4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div>
        <h3 className="m-0 font-display text-2xl font-semibold text-terracotta">
          You are on the list, {entry.fullName}.
        </h3>
        <p className="m-0 mt-2 font-sans text-base leading-relaxed text-charcoal">
          We have sent a confirmation to <strong>{entry.email}</strong>. We will be in touch
          before each programme opens — nothing else, and never a mailing list you did not
          ask for.
        </p>
      </div>
    </div>

    <dl className="grid gap-5 border-t border-sand pt-6 sm:grid-cols-2">
      <div>
        <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
          Your reference
        </dt>
        <dd className="m-0 mt-1 font-mono text-base font-semibold text-charcoal">
          {entry.reference}
        </dd>
      </div>
      <div>
        <dt className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
          Received
        </dt>
        <dd className="m-0 mt-1 font-sans text-base text-charcoal">
          {formatDateTime(entry.submittedAt)}
        </dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="mb-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
          Programmes
        </dt>
        <dd className="m-0 flex flex-wrap gap-2">
          {entry.programmes.map((id) => (
            <Tag key={id}>{getProgrammeName(id)}</Tag>
          ))}
        </dd>
      </div>
    </dl>

    <div>
      <Button variant="secondary" onClick={onAddAnother}>
        Add someone else
      </Button>
    </div>
  </div>
);
