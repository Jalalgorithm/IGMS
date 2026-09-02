import { useId } from 'react';
import { StatusChip } from '@/components/ui/StatusChip';
import { cn } from '@/utils/classNames';
import { groupProgrammes } from '../services/programmes';
import type { ProgrammeId } from '../types';

interface ProgrammePickerProps {
  selected: readonly ProgrammeId[];
  onToggle: (id: ProgrammeId) => void;
  error?: string;
}

/**
 * Multi-select over the programme catalogue, as a checkbox group rather than
 * a listbox — a visitor can pick several, and each option carries the audience
 * line so the choice is informed rather than guessed.
 */
export const ProgrammePicker = ({ selected, onToggle, error }: ProgrammePickerProps) => {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const groups = groupProgrammes();

  return (
    <fieldset
      className="m-0 border-0 p-0"
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-1 font-sans text-sm font-semibold text-charcoal">
        Which programmes are you interested in?
        <span className="ml-1 text-terracotta" aria-hidden="true">
          *
        </span>
      </legend>
      <p className="mb-4 font-sans text-sm text-warm-grey">
        Choose as many as you like. Programmes marked <em>Coming soon</em> are not running
        yet — joining the waitlist is how you hear first.
      </p>

      <div className="flex flex-col gap-5">
        {groups.map(({ group, items }) => (
          <div key={group}>
            <p className="mb-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-warm-grey">
              {group}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {items.map((programme) => {
                const isSelected = selected.includes(programme.id);
                const inputId = `${groupId}-${programme.id}`;
                return (
                  <label
                    key={programme.id}
                    htmlFor={inputId}
                    className={cn(
                      'group flex max-w-full cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] px-4 py-3 transition-colors duration-150',
                      isSelected
                        ? 'border-charcoal bg-marigold'
                        : 'border-sand bg-white hover:border-warm-grey',
                    )}
                  >
                    <input
                      type="checkbox"
                      id={inputId}
                      name="programmes"
                      value={programme.id}
                      checked={isSelected}
                      onChange={() => onToggle(programme.id)}
                      className="mt-[0.1875rem] size-[1.125rem] shrink-0 cursor-pointer rounded-[0.25rem] border-[1.5px] border-charcoal/40 accent-[var(--color-charcoal)]"
                    />
                    <span className="flex flex-col gap-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-sans text-sm font-semibold text-charcoal">
                          {programme.name}
                        </span>
                        {programme.availability === 'coming-soon' ? (
                          <StatusChip
                            kind="coming-soon"
                            className={isSelected ? 'border-charcoal/30 bg-transparent' : undefined}
                          />
                        ) : null}
                      </span>
                      <span className="font-sans text-xs leading-relaxed text-charcoal/75">
                        {programme.audience}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <p id={errorId} className="mt-3 font-sans text-sm font-medium text-terracotta">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
};
