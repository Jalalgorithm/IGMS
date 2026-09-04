import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/classNames';
import { CONTEXTS, TRANSPORT_MODES } from '../services/easyAskCopy';
import type { EasyAskContext, TransportMode } from '../types';

interface ContextStepProps {
  context: EasyAskContext | null;
  transportMode: TransportMode | null;
  canStart: boolean;
  onSelectContext: (context: EasyAskContext) => void;
  onSelectMode: (mode: TransportMode) => void;
  onStart: () => void;
}

const CARD =
  'flex w-full flex-col items-start gap-1 rounded-[var(--radius-tile)] border-[1.5px] p-4 text-left transition-colors duration-150';

export const ContextStep = ({
  context,
  transportMode,
  canStart,
  onSelectContext,
  onSelectMode,
  onStart,
}: ContextStepProps) => (
  <div className="flex flex-col gap-6 p-5 sm:p-6">
    {/* The promise the whole tool rests on, stated before anything is asked. */}
    <div className="rounded-[var(--radius-tile)] bg-terracotta/8 px-4 py-3">
      <p className="m-0 font-sans text-sm font-semibold text-charcoal">
        Nothing you type is saved.
      </p>
      <p className="m-0 mt-1 font-sans text-[0.8125rem] leading-relaxed text-charcoal/80">
        Free, no account, and about two minutes. Your answers are used to write your note and
        are not stored anywhere afterwards.
      </p>
    </div>

    <div>
      <h3 className="m-0 mb-1 font-display text-xl font-semibold text-charcoal">
        Where do you need to ask for support?
      </h3>
      <p className="m-0 mb-4 font-sans text-sm leading-relaxed text-warm-grey">
        Pick the one closest to your situation.
      </p>

      {/* Radio semantics, not buttons: this is one choice from a set, and a
          screen reader should say "2 of 4", not read four separate buttons. */}
      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">Where do you need to ask for support?</legend>
        <div className="grid grid-cols-2 gap-3">
          {CONTEXTS.map((item) => {
            const selected = context === item.id;
            return (
              <label
                key={item.id}
                className={cn(
                  CARD,
                  'cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta',
                  selected
                    ? 'border-terracotta bg-terracotta/8'
                    : 'border-sand bg-white hover:border-warm-grey',
                )}
              >
                <input
                  type="radio"
                  name="easyask-context"
                  value={item.id}
                  checked={selected}
                  onChange={() => onSelectContext(item.id)}
                  className="sr-only"
                />
                <span className="font-sans text-[0.9375rem] font-semibold text-charcoal">
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>

    {context === 'transport' ? (
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-3 p-0 font-sans text-sm font-semibold text-charcoal">
          What kind of journey?
        </legend>
        <div className="flex flex-col gap-3">
          {TRANSPORT_MODES.map((mode) => {
            const selected = transportMode === mode.id;
            return (
              <label
                key={mode.id}
                className={cn(
                  CARD,
                  'cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta',
                  selected
                    ? 'border-terracotta bg-terracotta/8'
                    : 'border-sand bg-white hover:border-warm-grey',
                )}
              >
                <input
                  type="radio"
                  name="easyask-transport-mode"
                  value={mode.id}
                  checked={selected}
                  onChange={() => onSelectMode(mode.id)}
                  className="sr-only"
                />
                <span className="font-sans text-[0.9375rem] font-semibold text-charcoal">
                  {mode.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    ) : null}

    <div>
      <p className="m-0 mb-2 font-sans text-sm font-semibold text-charcoal">Language</p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border-[1.5px] border-terracotta bg-terracotta/8 px-3 py-1.5 font-sans text-[0.8125rem] font-semibold text-terracotta">
          English
        </span>
        {['Bengali', 'Urdu', 'Somali', 'Polish'].map((language) => (
          <span
            key={language}
            className="rounded-full border-[1.5px] border-sand px-3 py-1.5 font-sans text-[0.8125rem] text-warm-grey"
          >
            {language} <span className="font-semibold">· soon</span>
          </span>
        ))}
      </div>
    </div>

    <Button onClick={onStart} disabled={!canStart} className="w-full">
      Start — about two minutes
    </Button>
  </div>
);
