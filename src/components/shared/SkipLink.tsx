/**
 * First tab stop on the page. Visually hidden until focused.
 */
export const SkipLink = () => (
  <a
    href="#main"
    className="sr-only rounded-full bg-terracotta px-6 py-3 font-sans text-sm font-semibold text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
  >
    Skip to main content
  </a>
);
