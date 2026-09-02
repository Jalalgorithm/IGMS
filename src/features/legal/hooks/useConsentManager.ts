import { useCallback, useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 500;
const POLL_LIMIT_MS = 15_000;

interface ConsentManager {
  /** True once the Usercentrics CMP has loaded and can show its panel. */
  isReady: boolean;
  openSettings: () => void;
}

/**
 * Tracks the Usercentrics consent manager.
 *
 * The CMP loads async from a third party, so it is normally absent on first
 * render and may never arrive at all (blocked by an extension, or by a
 * network the visitor is behind). It announces itself with
 * `UC_UI_INITIALIZED`; the poll is the belt to that braces, and it gives up
 * rather than running for the life of the page.
 */
export const useConsentManager = (): ConsentManager => {
  const [isReady, setIsReady] = useState<boolean>(
    () => typeof window !== 'undefined' && Boolean(window.UC_UI),
  );

  useEffect(() => {
    if (isReady) return;

    const markReady = (): void => setIsReady(true);
    window.addEventListener('UC_UI_INITIALIZED', markReady);

    const startedAt = Date.now();
    const poll = window.setInterval(() => {
      if (window.UC_UI) {
        markReady();
        window.clearInterval(poll);
      } else if (Date.now() - startedAt > POLL_LIMIT_MS) {
        window.clearInterval(poll);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener('UC_UI_INITIALIZED', markReady);
      window.clearInterval(poll);
    };
  }, [isReady]);

  const openSettings = useCallback(() => {
    window.UC_UI?.showSecondLayer();
  }, []);

  return { isReady, openSettings };
};
