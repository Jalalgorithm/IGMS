import { useId } from 'react';
import { Link } from 'react-router';
import { cn } from '@/utils/classNames';
import { isEmail } from '@/utils/validation';
import type { ContactChannel } from '../types';

const CHANNELS: ReadonlyArray<{ value: ContactChannel; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'post', label: 'Post' },
];

/** Public contact address for withdrawal requests; only used if it is a real address. */
const CONTACT_EMAIL = (() => {
  const configured = import.meta.env.VITE_CONTACT_EMAIL?.trim() ?? '';
  return isEmail(configured) ? configured : null;
})();

/** ICO registration number — public record, verifiable at ico.org.uk. */
const ICO_REGISTRATION = 'ZB971396';

interface ContactConsentProps {
  selected: readonly ContactChannel[];
  onToggle: (channel: ContactChannel) => void;
  onBlur: () => void;
  error?: string;
}

/**
 * "Keeping in touch" consent. Each channel is consented to separately, as UK
 * GDPR/PECR expect, and nothing is pre-ticked.
 */
export const ContactConsent = ({ selected, onToggle, onBlur, error }: ContactConsentProps) => {
  const groupId = useId();
  const introId = `${groupId}-intro`;
  const errorId = `${groupId}-error`;

  return (
    <fieldset
      className="m-0 border-0 p-0"
      aria-describedby={cn(introId, error && errorId)}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-1 font-display text-lg font-semibold text-charcoal">
        Keeping in touch
        <span className="ml-1 text-terracotta" aria-hidden="true">
          *
        </span>
      </legend>
      <p id={introId} className="m-0 mb-4 font-sans text-sm leading-relaxed text-charcoal">
        I would like IGMS to contact me by email, phone or post (tick all that apply) with
        information about the programmes I have selected.
      </p>

      <div className="flex flex-wrap gap-3">
        {CHANNELS.map(({ value, label }) => {
          const id = `${groupId}-${value}`;
          const checked = selected.includes(value);
          return (
            <label
              key={value}
              htmlFor={id}
              className={cn(
                'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-2 font-sans text-sm font-medium text-charcoal transition-colors focus-within:border-terracotta',
                checked
                  ? 'border-terracotta bg-terracotta/8'
                  : 'border-sand bg-white hover:border-warm-grey',
                error && !checked ? 'border-terracotta' : null,
              )}
            >
              <input
                type="checkbox"
                id={id}
                name="contactChannels"
                value={value}
                checked={checked}
                onChange={() => onToggle(value)}
                onBlur={onBlur}
                className="size-5 shrink-0 cursor-pointer accent-[var(--color-terracotta)]"
              />
              {label}
            </label>
          );
        })}
      </div>

      {error ? (
        <p id={errorId} className="m-0 mt-3 font-sans text-sm font-medium text-terracotta">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 rounded-xl bg-ivory px-5 py-4 font-sans text-[0.8125rem] leading-relaxed text-charcoal hc-outline">
        <p className="m-0">
          We will use your details only for this purpose. We will never sell your information or
          share it with other organisations for their own marketing. You can withdraw your consent
          at any time by clicking &ldquo;unsubscribe&rdquo; in any email, or by contacting us
          {CONTACT_EMAIL ? (
            <>
              {' '}
              at{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-terracotta underline underline-offset-4 hover:text-charcoal"
              >
                {CONTACT_EMAIL}
              </a>
            </>
          ) : null}
          . Withdrawing consent will not affect any contact made before you withdrew.
        </p>
        <p className="m-0">
          For full details of how we collect, use and protect your personal data, and your rights
          under UK data protection law, please read our{' '}
          <Link
            to="/privacy-policy"
            className="font-medium text-terracotta underline underline-offset-4 hover:text-charcoal"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <p className="m-0">
          IGMS is registered with the Information Commissioner&rsquo;s Office (ICO) under
          registration number {ICO_REGISTRATION}. You can verify this at{' '}
          <a
            href="https://ico.org.uk/ESDWebPages/Search"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-terracotta underline underline-offset-4 hover:text-charcoal"
          >
            ico.org.uk
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </div>
    </fieldset>
  );
};
