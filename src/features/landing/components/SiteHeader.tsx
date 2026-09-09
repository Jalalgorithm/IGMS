import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mark from '@/assets/brand/igms-mark.png';
import { LinkButton } from '@/components/ui/Button';
import { NavDropdown } from '@/components/ui/NavDropdown';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { scrollToSection } from '@/utils/scrollToSection';
import { cn } from '@/utils/classNames';
import { DONATE_URL, NAV_ENTRIES, NAV_ITEMS, ORG } from '../navigation';
import { isNavGroup } from '../types';

export const SiteHeader = () => {
  // Back to 1024 now that the bar carries four entries rather than seven.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isLandingPage = pathname === '/';

  // The mobile menu has no meaning once the desktop bar is showing.
  useEffect(() => {
    if (isDesktop) setIsMenuOpen(false);
  }, [isDesktop]);

  const goToSection = (targetId: string): void => {
    setIsMenuOpen(false);

    if (isLandingPage) {
      scrollToSection(targetId);
      return;
    }

    // From a policy page these anchors have nothing to scroll to, so go home
    // first and scroll once the section has actually rendered.
    navigate('/');
    window.requestAnimationFrame(() => scrollToSection(targetId));
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string): void => {
    event.preventDefault();
    goToSection(targetId);
  };

  const navLinks = NAV_ENTRIES.map((entry) =>
    isNavGroup(entry) ? (
      <NavDropdown
        key={entry.id}
        id={entry.id}
        label={entry.label}
        items={entry.children}
        {...(entry.targetId ? { targetId: entry.targetId } : {})}
        onNavigate={goToSection}
      />
    ) : (
      <a
        key={entry.targetId}
        href={`#${entry.targetId}`}
        onClick={(event) => handleNavClick(event, entry.targetId)}
        className="font-sans text-sm font-medium text-charcoal no-underline transition-colors duration-150 hover:text-terracotta"
      >
        {entry.label}
      </a>
    ),
  );

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/8 bg-ivory/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-6 px-6 py-3 md:px-10">
        {/* The supplied lockup sets the wordmark in marigold, which fails
            contrast on ivory (1.9:1), and its strapline is unreadable at
            header size. The mark is paired with real text instead. */}
        <a
          href="#hero"
          onClick={(event) => handleNavClick(event, 'hero')}
          className="flex shrink-0 items-center gap-3 no-underline"
          aria-label={`${ORG.shortName}, ${ORG.legalName} — back to top`}
        >
          <img
            src={mark}
            alt=""
            aria-hidden="true"
            className="h-11 w-auto object-contain md:h-12"
            width={692}
            height={615}
          />
          <span aria-hidden="true" className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold text-terracotta md:text-2xl">
              {ORG.shortName}
            </span>
            <span className="mt-1 hidden font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-warm-grey sm:block">
              Integrated Global Menospace Solutions CIC
            </span>
          </span>
        </a>

        {isDesktop ? (
          <nav aria-label="Primary" className="flex items-center gap-6">
            {navLinks}
            <LinkButton href={DONATE_URL} variant="primary" size="sm" external>
              Donate
            </LinkButton>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <LinkButton href={DONATE_URL} variant="primary" size="sm" external>
              Donate
            </LinkButton>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-charcoal text-charcoal"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                {isMenuOpen ? (
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        )}
      </div>

      {!isDesktop ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className={cn(
            'overflow-hidden border-t border-charcoal/8 bg-ivory transition-[max-height] duration-300',
            // Tall enough for the flattened list — every group's children are
            // listed here rather than hidden behind a nested flyout.
            isMenuOpen ? 'max-h-[34rem]' : 'max-h-0 border-t-0',
          )}
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.targetId}
                href={`#${item.targetId}`}
                onClick={(event) => handleNavClick(event, item.targetId)}
                tabIndex={isMenuOpen ? 0 : -1}
                className="rounded-lg px-2 py-3 font-sans text-base font-medium text-charcoal no-underline hover:bg-marigold/20"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
};
