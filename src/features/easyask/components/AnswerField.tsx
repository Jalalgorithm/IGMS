import { useCallback, useId } from 'react';
import { cn } from '@/utils/classNames';
import { useSpeechInput } from '../hooks/useSpeechInput';
import { ANSWER_MAX_LENGTH } from '../services/easyAskCopy';

interface AnswerFieldProps {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

const MicIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
    <path
      d="M5 11a7 7 0 0 0 14 0M12 18v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const AnswerField = ({ label, hint, value, onChange, autoFocus }: AnswerFieldProps) => {
  const id = useId();
  const hintId = `${id}-hint`;
  const countId = `${id}-count`;

  const appendTranscript = useCallback(
    (text: string) => {
      // Appended rather than replacing: dictation supplements what has already
      // been typed instead of wiping it.
      const next = value.trim() ? `${value.trim()} ${text}` : text;
      onChange(next.slice(0, ANSWER_MAX_LENGTH));
    },
    [value, onChange],
  );

  const speech = useSpeechInput(appendTranscript);
  const remaining = ANSWER_MAX_LENGTH - value.length;

  return (
    <div className="rounded-[var(--radius-tile)] border-[1.5px] border-sand bg-white p-4">
      <label htmlFor={id} className="m-0 block font-sans text-[0.9375rem] font-semibold text-charcoal">
        {label}
      </label>
      <p id={hintId} className="m-0 mb-3 mt-1 font-sans text-[0.8125rem] leading-relaxed text-warm-grey">
        {hint}
      </p>

      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, ANSWER_MAX_LENGTH))}
        maxLength={ANSWER_MAX_LENGTH}
        rows={3}
        autoFocus={autoFocus}
        aria-describedby={`${hintId} ${countId}`}
        placeholder="Type here, in your own words…"
        className="w-full resize-none rounded-xl border-[1.5px] border-sand bg-ivory px-3 py-2.5 font-sans text-[0.9375rem] leading-relaxed text-charcoal placeholder:text-warm-grey/70 focus:border-terracotta"
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        {speech.isSupported ? (
          <button
            type="button"
            onClick={speech.isListening ? speech.stop : speech.start}
            aria-pressed={speech.isListening}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border-[1.5px] px-3 py-1.5 font-sans text-[0.8125rem] font-semibold transition-colors',
              speech.isListening
                ? 'border-terracotta bg-terracotta text-ivory'
                : 'border-sand text-charcoal hover:border-charcoal',
            )}
          >
            <MicIcon className="size-4" />
            {speech.isListening ? 'Listening — tap to stop' : 'Speak instead'}
          </button>
        ) : (
          <span />
        )}

        <span
          id={countId}
          aria-live="polite"
          className={cn(
            'font-sans text-xs tabular-nums',
            remaining <= 20 ? 'font-semibold text-terracotta' : 'text-warm-grey',
          )}
        >
          {remaining} left
        </span>
      </div>
    </div>
  );
};
