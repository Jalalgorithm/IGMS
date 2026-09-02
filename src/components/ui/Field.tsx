import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/utils/classNames';

const CONTROL =
  'w-full rounded-xl border bg-white px-4 py-3 font-sans text-base text-charcoal placeholder:text-warm-grey/70 transition-colors duration-150';

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%238A7F74' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6l5 5 5-5'/%3E%3C/svg%3E\")";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (ids: { describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

const FieldShell = ({ id, label, hint, error, required, children }: FieldShellProps) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-sans text-sm font-semibold text-charcoal">
        {label}
        {required ? (
          <span className="ml-1 text-terracotta" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 font-normal text-warm-grey">(optional)</span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="font-sans text-sm leading-relaxed text-warm-grey">
          {hint}
        </p>
      ) : null}

      {children({ describedBy: describedBy || undefined, invalid: Boolean(error) })}

      {error ? (
        <p id={errorId} className="font-sans text-sm font-medium text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
};

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
}

export const TextField = ({ label, hint, error, className, name, ...rest }: TextFieldProps) => {
  const generated = useId();
  const id = name ? `waitlist-${name}` : generated;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={rest.required}>
      {({ describedBy, invalid }) => (
        <input
          id={id}
          name={name}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            CONTROL,
            invalid ? 'border-terracotta' : 'border-sand hover:border-warm-grey',
            className,
          )}
          {...rest}
        />
      )}
    </FieldShell>
  );
};

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
}

export const TextAreaField = ({
  label,
  hint,
  error,
  className,
  name,
  ...rest
}: TextAreaFieldProps) => {
  const generated = useId();
  const id = name ? `waitlist-${name}` : generated;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={rest.required}>
      {({ describedBy, invalid }) => (
        <textarea
          id={id}
          name={name}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            CONTROL,
            'min-h-28 resize-y leading-relaxed',
            invalid ? 'border-terracotta' : 'border-sand hover:border-warm-grey',
            className,
          )}
          {...rest}
        />
      )}
    </FieldShell>
  );
};

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}

export const SelectField = ({
  label,
  hint,
  error,
  className,
  name,
  options,
  ...rest
}: SelectFieldProps) => {
  const generated = useId();
  const id = name ? `waitlist-${name}` : generated;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={rest.required}>
      {({ describedBy, invalid }) => (
        <select
          id={id}
          name={name}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          // Inline rather than an arbitrary Tailwind value: the data URI has
          // to survive class extraction intact, and quoting it there does not.
          style={{ backgroundImage: CHEVRON }}
          className={cn(
            CONTROL,
            'appearance-none bg-[length:1rem_1rem] bg-[right_1rem_center] bg-no-repeat pr-10',
            invalid ? 'border-terracotta' : 'border-sand hover:border-warm-grey',
            className,
          )}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
};
