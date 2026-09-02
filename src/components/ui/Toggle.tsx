import { useId } from 'react';
import { cn } from '@/utils/classNames';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Extra context announced with the label. */
  description?: string;
}

/**
 * Switch built on a real button with `role="switch"` so it announces its
 * state, rather than a styled checkbox that needs extra wiring.
 */
export const Toggle = ({ label, checked, onChange, description }: ToggleProps) => {
  const labelId = useId();
  const descriptionId = `${labelId}-description`;

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="flex flex-col">
        <span id={labelId} className="font-sans text-xs font-semibold uppercase tracking-[0.06em] text-charcoal">
          {label}
        </span>
        {description ? (
          <span id={descriptionId} className="font-sans text-xs text-warm-grey">
            {description}
          </span>
        ) : null}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200',
          checked ? 'border-terracotta bg-terracotta' : 'border-sand bg-sand/40',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-[left] duration-200',
            checked ? 'left-[1.375rem]' : 'left-[0.125rem]',
          )}
        />
      </button>
    </div>
  );
};
