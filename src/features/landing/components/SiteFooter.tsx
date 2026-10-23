import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import mark from '@/assets/brand/igms-mark.png';
// Imported from the legal feature's leaf modules rather than its barrel: the
// barrel re-exports PolicyPage, which renders this footer, and going through
// it would make the two features' barrels circular.
import { PrivacySettingsButton } from '@/features/legal/components/PrivacySettingsButton';
import { POLICIES, policyPath } from '@/features/legal/policies';
import { scrollToSection } from '@/utils/scrollToSection';
import { NAV_ITEMS, ORG, ORG_NG } from '../navigation';

const LINK =
  'font-medium text-ivory underline decoration-ivory/40 underline-offset-[3px] hover:text-marigold hover:decoration-marigold';

const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

/** A pending value, shown as such rather than as a bracketed placeholder. */
const Pending = ({ children = 'Pending' }: { children?: ReactNode }) => (
  <span className="italic text-ivory/60">{children}</span>
);

const Detail = ({ heading, children }: { heading: string; children: ReactNode }) => (
  <div>
    <h4 className="m-0 mb-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-marigold">
      {heading}
    </h4>
    <div className="font-sans text-[0.8125rem] leading-relaxed text-ivory/80">{children}</div>
  </div>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 shrink-0 fill-[#25D366]">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" />
  </svg>
);

/**
 * Two organisations, two jurisdictions: the UK CIC and the Nigerian LBG each
 * get a column carrying their own registration and data-protection details,
 * so a visitor can tell at a glance which body holds their data.
 *
 * The mark is used rather than the full lockup: the wordmark is terracotta on
 * near-white, which does not survive being placed on charcoal.
 */
export const SiteFooter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ): void => {
    event.preventDefault();
    if (pathname === '/') {
      scrollToSection(targetId);
      return;
    }
    navigate('/');
    window.requestAnimationFrame(() => scrollToSection(targetId));
  };

  return (
    <footer className="on-dark bg-charcoal px-6 pb-10 pt-16 text-ivory md:px-12">
      <div className="mx-auto max-w-[80rem]">
        {/* Brand + site navigation */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-8 border-b border-ivory/15 pb-10">
          <div className="flex items-center gap-3">
            <img src={mark} alt="" className="h-12 w-auto object-contain" aria-hidden="true" />
            <span className="font-display text-xl font-semibold text-marigold">
              Integrated Global Menospace Solutions
            </span>
          </div>
          <nav aria-label="Footer">
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
              {NAV_ITEMS.map((item) => (
                <li key={item.targetId}>
                  <a
                    href={`#${item.targetId}`}
                    onClick={(event) => handleSectionClick(event, item.targetId)}
                    className="font-sans text-sm font-medium text-ivory/85 no-underline hover:text-marigold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* United Kingdom */}
          <section aria-labelledby="footer-uk" className="flex flex-col gap-6">
            <div>
              <p className="m-0 mb-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ivory/60">
                United Kingdom
              </p>
              <h3 id="footer-uk" className="m-0 font-display text-2xl font-semibold text-ivory">
                IGMS-CIC
              </h3>
            </div>

            <Detail heading="Registered office">
              <address className="not-italic">
                <strong className="font-semibold text-ivory">{ORG.legalName}</strong>
                <br />
                {ORG.address}
              </address>
            </Detail>

            <Detail heading="Data protection">
              <p className="m-0">
                Registered with the Information Commissioner&rsquo;s Office (ICO).
                <br />
                ICO registration no.{' '}
                <strong className="font-semibold text-ivory">{ORG.icoRegistration}</strong> ·{' '}
                <a href={ORG.icoRegisterUrl} target="_blank" rel="noreferrer noopener" className={LINK}>
                  Verify at ico.org.uk
                  <NewTab />
                </a>
              </p>
            </Detail>

            <Detail heading="Company">
              <p className="m-0">
                Community Interest Company · Company number{' '}
                <strong className="font-semibold text-ivory">{ORG.registeredNumber}</strong>
              </p>
            </Detail>
          </section>

          {/* Nigeria */}
          <section
            aria-labelledby="footer-ng"
            className="flex flex-col gap-6 border-t border-ivory/15 pt-12 md:border-l md:border-t-0 md:pl-16 md:pt-0"
          >
            <div>
              <p className="m-0 mb-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ivory/60">
                Nigeria
              </p>
              <h3 id="footer-ng" className="m-0 font-display text-2xl font-semibold text-ivory">
                {ORG_NG.shortName}
              </h3>
            </div>

            <Detail heading="Lagos office">
              <p className="m-0">
                <strong className="font-semibold text-ivory">{ORG_NG.legalName}</strong>
                <br />
                {ORG_NG.lagosAddress ?? <Pending>Address to be confirmed</Pending>}
              </p>
            </Detail>

            <Detail heading="Contact">
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                <li>
                  <a
                    href={ORG_NG.whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`${LINK} inline-flex items-center gap-2`}
                  >
                    <WhatsAppIcon />
                    WhatsApp {ORG_NG.whatsappNumber}
                    <NewTab />
                  </a>
                </li>
                <li>
                  Email:{' '}
                  <a href={`mailto:${ORG_NG.email}`} className={LINK}>
                    {ORG_NG.email}
                  </a>
                </li>
                <li>
                  Website:{' '}
                  <a href={ORG_NG.websiteUrl} target="_blank" rel="noreferrer noopener" className={LINK}>
                    {ORG_NG.websiteLabel}
                    <NewTab />
                  </a>
                </li>
              </ul>
            </Detail>

            <Detail heading="Data protection">
              <p className="m-0">
                Your details are handled under the{' '}
                <strong className="font-semibold text-ivory">Nigeria Data Protection Act 2023</strong>.
                <br />
                NDPC no.{' '}
                {ORG_NG.ndpcNumber ? (
                  <strong className="font-semibold text-ivory">{ORG_NG.ndpcNumber}</strong>
                ) : (
                  <Pending />
                )}
                <br />
                {ORG_NG.privacyPolicyUrl ? (
                  <a href={ORG_NG.privacyPolicyUrl} className={LINK}>
                    Nigeria Privacy Policy
                  </a>
                ) : (
                  <>
                    Nigeria Privacy Policy: <Pending>coming soon</Pending>
                  </>
                )}
              </p>
            </Detail>

            <Detail heading="Regulatory & compliance">
              <p className="m-0">
                Lagos State Ministry of Health approval:{' '}
                <strong className="font-semibold text-ivory">{ORG_NG.healthApproval}</strong> (
                {ORG_NG.healthApprovalDate})
                <br />
                HEFAMAA accreditation:{' '}
                {ORG_NG.hefamaaAccreditation ? (
                  <strong className="font-semibold text-ivory">{ORG_NG.hefamaaAccreditation}</strong>
                ) : (
                  <Pending />
                )}
              </p>
            </Detail>

            <Detail heading="Service notice">
              <p className="m-0">Non-clinical service: no diagnosis or prescribed medicines.</p>
            </Detail>

            <p className="m-0 font-sans text-[0.8125rem] text-ivory/80">
              {ORG_NG.shortName} · RC {ORG_NG.rcNumber}
            </p>
          </section>
        </div>

        {/* Legal bar */}
        <div className="mt-14 border-t border-ivory/15 pt-6">
          <nav aria-label="Legal" className="mb-5">
            <ul className="m-0 flex list-none flex-wrap items-center gap-x-6 gap-y-3 p-0">
              {POLICIES.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    to={policyPath(policy.slug)}
                    className="font-sans text-sm font-medium text-ivory/85 no-underline hover:text-marigold"
                  >
                    {policy.title}
                  </Link>
                </li>
              ))}
              <li>
                <PrivacySettingsButton />
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-2 font-sans text-xs text-ivory/70 md:flex-row md:items-end md:justify-between">
            <p className="m-0">
              &copy; {new Date().getFullYear()} Integrated Global Menospace Solutions. All rights
              reserved.
            </p>
            {/* Required by CC-BY 4.0 for the self-hosted flag font. */}
            <p className="m-0">
              Country flag graphics by{' '}
              <a
                href="https://github.com/twitter/twemoji"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/90 underline underline-offset-2 hover:text-marigold"
              >
                Twemoji
                <NewTab />
              </a>
              , licensed under{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer license"
                className="text-ivory/90 underline underline-offset-2 hover:text-marigold"
              >
                CC BY 4.0
                <NewTab />
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
