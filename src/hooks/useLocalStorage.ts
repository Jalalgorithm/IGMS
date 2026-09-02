import { useCallback, useEffect, useState } from 'react';

/**
 * localStorage-backed state. Reads and writes are wrapped because private
 * windows and blocked-site-data settings throw on access rather than
 * returning null.
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
): readonly [T, (value: T | ((previous: T) => T)) => void] => {
  const [stored, setStored] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initialValue : (JSON.parse(raw) as T);
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((previous: T) => T)) => {
      setStored((previous) => {
        const next = value instanceof Function ? value(previous) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* storage unavailable — keep the in-memory value */
        }
        return next;
      });
    },
    [key],
  );

  // Keep duplicate tabs in step.
  useEffect(() => {
    const onStorage = (event: StorageEvent): void => {
      if (event.key !== key || event.newValue === null) return;
      try {
        setStored(JSON.parse(event.newValue) as T);
      } catch {
        /* ignore malformed payloads from other tabs */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [stored, setValue] as const;
};
