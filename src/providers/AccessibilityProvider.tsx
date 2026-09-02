import { useEffect, type ReactNode } from 'react';
import { useAccessibilityStore } from '@/stores/accessibilityStore';

interface AccessibilityProviderProps {
  children: ReactNode;
}

/**
 * Projects the reader preferences onto <html> as data attributes. Every
 * visual consequence lives in CSS (index.css), so nothing here needs to know
 * what "high contrast" actually looks like.
 */
export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const textSize = useAccessibilityStore((state) => state.textSize);
  const highContrast = useAccessibilityStore((state) => state.highContrast);
  const reduceMotion = useAccessibilityStore((state) => state.reduceMotion);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset['textSize'] = textSize;
    if (highContrast) root.dataset['contrast'] = 'high';
    else delete root.dataset['contrast'];
    if (reduceMotion) root.dataset['motion'] = 'reduced';
    else delete root.dataset['motion'];
  }, [textSize, highContrast, reduceMotion]);

  return children;
};
