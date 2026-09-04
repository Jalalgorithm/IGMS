import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/classNames';
import type { ShortNote } from '../types';

interface NoteStepProps {
  note: ShortNote;
  onEdit: () => void;
  onRestart: () => void;
}

const SpeakerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
    <path
      d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Support signposting, shown only when the model flags risk of harm.
 *
 * A writing aid is the wrong tool at that moment, so the note is still there
 * but it is no longer the first thing on the screen. Numbers are UK-wide and
 * free to call.
 */
const ConcernNotice = () => (
  <div
    role="alert"
    className="rounded-[var(--radius-tile)] border-[1.5px] border-terracotta bg-terracotta/8 p-4"
  >
    <p className="m-0 mb-2 font-display text-base font-semibold text-terracotta">
      If you are not safe right now, please talk to someone today.
    </p>
    <ul className="m-0 list-none space-y-1.5 p-0 font-sans text-[0.875rem] leading-relaxed text-charcoal">
      <li>
        <strong>Samaritans</strong> — call{' '}
        <a href="tel:116123" className="font-semibold text-terracotta underline underline-offset-2">
          116 123
        </a>
        , free, any time.
      </li>
      <li>
        <strong>NHS</strong> — call{' '}
        <a href="tel:111" className="font-semibold text-terracotta underline underline-offset-2">
          111
        </a>{' '}
        and choose the mental health option.
      </li>
      <li>
        In an emergency, call{' '}
        <a href="tel:999" className="font-semibold text-terracotta underline underline-offset-2">
          999
        </a>
        .
      </li>
    </ul>
  </div>
);

export const NoteStep = ({ note, onEdit, onRestart }: NoteStepProps) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);

  const plainText = `${note.title}\n\n${note.lines.join(' ')}`;

  useEffect(
    () => () => {
      window.clearTimeout(copyTimer.current);
      window.speechSynthesis?.cancel();
    },
    [],
  );

  const handleCopy = useCallback(() => {
    const done = (): void => {
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2400);
    };

    // The clipboard API needs a secure context; the textarea fallback keeps
    // Copy working over plain http and in older browsers.
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(plainText).then(done).catch(done);
      return;
    }
    const scratch = document.createElement('textarea');
    scratch.value = plainText;
    scratch.setAttribute('readonly', '');
    scratch.style.position = 'fixed';
    scratch.style.opacity = '0';
    document.body.appendChild(scratch);
    scratch.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(scratch);
      done();
    }
  }, [plainText]);

  const handleSpeak = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = 'en-GB';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synth.speak(utterance);
    setIsSpeaking(true);
  }, [plainText]);

  const canShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  const handleShare = useCallback(() => {
    navigator.share?.({ title: note.title, text: plainText }).catch(() => {
      /* dismissed by the person — nothing to report */
    });
  }, [note.title, plainText]);

  return (
    <div className="flex flex-col gap-5 p-5 sm:p-6">
      {note.concern ? <ConcernNotice /> : null}

      <div className="rounded-[var(--radius-tile)] border-2 border-marigold bg-white p-5">
        <p className="m-0 mb-3 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
          {note.title}
        </p>
        <div className="flex flex-col gap-3">
          {note.lines.map((line) => (
            <div key={line} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-terracotta"
              />
              <p className="m-0 font-sans text-[0.9375rem] leading-relaxed text-charcoal">
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSpeak}
        aria-pressed={isSpeaking}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] px-4 py-2.5 font-sans text-sm font-semibold transition-colors',
          isSpeaking
            ? 'border-terracotta bg-terracotta text-ivory'
            : 'border-sand bg-white text-charcoal hover:border-charcoal',
        )}
      >
        <SpeakerIcon className="size-4" />
        {isSpeaking ? 'Stop reading' : 'Read this aloud'}
      </button>

      <p className="m-0 text-center font-sans text-[0.8125rem] leading-relaxed text-warm-grey">
        You have a right to ask for this, and it is fine to need support.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button onClick={handleCopy} className="flex-1">
            {copied ? 'Copied' : 'Copy'}
          </Button>
          {canShare ? (
            <Button variant="secondary" onClick={handleShare} className="flex-1">
              Share
            </Button>
          ) : null}
        </div>

        <Button variant="secondary" onClick={onEdit}>
          Change my words
        </Button>
        <button
          type="button"
          onClick={onRestart}
          className="font-sans text-sm font-medium text-terracotta underline underline-offset-4 hover:text-charcoal"
        >
          Start over
        </button>
      </div>

      <p className="m-0 text-center font-sans text-xs leading-relaxed text-warm-grey">
        Copy or share your note before you close this — nothing is saved, so it will be gone
        when you do.
      </p>

      <span aria-live="polite" className="sr-only">
        {copied ? 'Note copied to your clipboard.' : ''}
      </span>
    </div>
  );
};
