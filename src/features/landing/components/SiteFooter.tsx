import { Link, useLocation, useNavigate } from 'react-router-dom';
import mark from '@/assets/brand/igms-mark.png';
// Imported from the legal feature's leaf modules rather than its barrel: the
// barrel re-exports PolicyPage, which renders this footer, and going through
// it would make the two features' barrels circular.
import { PrivacySettingsButton } from '@/features/legal/components/PrivacySettingsButton';
import { POLICIES, policyPath } from '@/features/legal/policies';
import { scrollToSection } from '@/utils/scrollToSection';
import { NAV_ITEMS, ORG } from '../navigation';

/**
 * The mark is used here rather than the full lockup: the wordmark below it is
 * terracotta on near-white, which does not survive being placed on charcoal.
 * The organisation name is set as real text instead, in ivory.
 *
 * No Donate button — it lives in the header only.
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
    <footer className="bg-charcoal px-6 pb-10 pt-16 text-ivory md:px-12">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-10">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src={mark} alt="" className="h-14 w-auto object-contain" aria-hidden="true" />
              <span className="font-display text-xl font-semibold text-marigold">
                {ORG.shortName}
              </span>
            </div>
            <p className="m-0 max-w-xs font-sans text-[0.8125rem] leading-relaxed text-ivory/60">
              {ORG.legalName}
              <br />
              Registered No: {ORG.registeredNumber}
              <br />
              {ORG.address}
            </p>
          </div>

          <nav aria-label="Footer" className="on-dark flex flex-wrap gap-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.targetId}
                href={`#${item.targetId}`}
                onClick={(event) => handleSectionClick(event, item.targetId)}
                className="font-sans text-sm font-medium text-ivory/85 no-underline hover:text-marigold"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="on-dark border-t border-ivory/15 pt-6">
          <nav aria-label="Legal" className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            {POLICIES.map((policy) => (
              <Link
                key={policy.slug}
                to={policyPath(policy.slug)}
                className="font-sans text-sm font-medium text-ivory/85 no-underline hover:text-marigold"
              >
                {policy.title}
              </Link>
            ))}
            <PrivacySettingsButton />
          </nav>

          <p className="m-0 font-sans text-xs text-ivory/45">
            &copy; {new Date().getFullYear()} {ORG.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
