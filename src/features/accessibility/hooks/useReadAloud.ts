import { useCallback, useEffect, useState } from 'react';
import type { ReadAloudControls, ReadAloudStatus } from '../types';

/** Elements whose text would be noise when read end to end. */
const SKIP = 'script, style, nav, footer, [aria-hidden="true"], .sr-only, [data-read-aloud="skip"]';

const collectPageText = (): string => {
  const root = document.getElementById('main') ?? document.body;
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(SKIP).forEach((node) => node.remove());

  return clone.innerText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('. ')
    .replace(/\.{2,}/g, '.')
    .slice(0, 30_000);
};

/**
 * "Read this screen aloud", built on the browser's own speech synthesis.
 *
 * Utterances are chunked because most engines silently truncate or stall on
 * very long strings; the queue means a long page still reads end to end.
 */
export const useReadAloud = (): ReadAloudControls => {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [status, setStatus] = useState<ReadAloudStatus>(supported ? 'idle' : 'unsupported');

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setStatus('idle');
  }, [supported]);

  const speak = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();

    const text = collectPageText();
    if (!text) return;

    const chunks = text.match(/[\s\S]{1,220}(?:\.|$)/g) ?? [text];
    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.lang = 'en-GB';
      utterance.rate = 0.95;
      if (index === chunks.length - 1) {
        utterance.onend = () => setStatus('idle');
      }
      utterance.onerror = () => setStatus('idle');
      window.speechSynthesis.speak(utterance);
    });

    setStatus('speaking');
  }, [supported]);

  const toggle = useCallback(() => {
    if (status === 'speaking') stop();
    else speak();
  }, [status, speak, stop]);

  // Never leave speech running after the page goes away.
  useEffect(() => {
    if (!supported) return;
    const cancel = (): void => window.speechSynthesis.cancel();
    window.addEventListener('pagehide', cancel);
    return () => {
      window.removeEventListener('pagehide', cancel);
      cancel();
    };
  }, [supported]);

  return { status, speak, stop, toggle };
};
