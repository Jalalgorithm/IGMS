/**
 * Anchor navigation that keeps keyboard users oriented: the browser's own
 * smooth scroll moves the viewport, but focus has to be moved deliberately
 * or a screen reader stays where it was.
 */
export const scrollToSection = (id: string): void => {
  const target = document.getElementById(id);
  if (!target) return;

  const reduced =
    document.documentElement.dataset['motion'] === 'reduced' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
  }
  target.focus({ preventScroll: true });
};
