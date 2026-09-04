import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal shape of the Web Speech recognition API. It is not in lib.dom, and
 * only the handful of members used here are declared.
 */
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type RecognitionConstructor = new () => SpeechRecognitionLike;

const getConstructor = (): RecognitionConstructor | null => {
  if (typeof window === 'undefined') return null;
  const candidate = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return candidate.SpeechRecognition ?? candidate.webkitSpeechRecognition ?? null;
};

interface SpeechInput {
  /** False in Firefox and older browsers — hide the control rather than fail. */
  isSupported: boolean;
  isListening: boolean;
  start: () => void;
  stop: () => void;
}

/**
 * Dictation for the two answer boxes.
 *
 * Speech is transcribed by the browser, and on Chrome that means it goes to
 * Google's servers — which is not something to switch on quietly for a tool
 * that promises nothing is stored. So it only ever runs on an explicit press,
 * never automatically, and the UI says what it is doing while it listens.
 */
export const useSpeechInput = (onTranscript: (text: string) => void): SpeechInput => {
  const [isSupported] = useState(() => getConstructor() !== null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const callbackRef = useRef(onTranscript);

  // Kept in a ref so a re-render with a new closure does not have to tear the
  // recognition instance down mid-sentence.
  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    const Recognition = getConstructor();
    if (!Recognition) return;

    recognitionRef.current?.abort();

    const recognition = new Recognition();
    recognition.lang = 'en-GB';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_unused, index) => {
        const alternatives = event.results[index];
        return alternatives?.[0]?.transcript ?? '';
      })
        .join(' ')
        .trim();
      if (transcript) callbackRef.current(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { isSupported, isListening, start, stop };
};
