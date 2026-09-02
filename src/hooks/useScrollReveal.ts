import { useEffect, useRef, type RefObject } from 'react';

/**
 * Reveals an element once, when it first enters the viewport. Returns a ref
 * to attach to the element. Falls back to visible immediately when
 * IntersectionObserver is unavailable.
 */
export const useScrollReveal = <T extends HTMLElement>(): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      node.dataset['revealed'] = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset['revealed'] = 'true';
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
};
