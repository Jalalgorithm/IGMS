import { useEffect, type RefObject } from 'react';

export const useOnClickOutside = (
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  handler: () => void,
  enabled = true,
): void => {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target as Node | null;
      if (!target) return;
      const inside = refs.some((ref) => ref.current?.contains(target));
      if (!inside) handler();
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [refs, handler, enabled]);
};
