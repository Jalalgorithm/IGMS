import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/classNames';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: ReactNode;
  error?: string;
}

export const Checkbox = ({ label, error, className, name, ...rest }: CheckboxProps) => {
  const generated = useId();
  const id = name ? `waitlist-${name}` : generated;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={id}
          name={name}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            'mt-[0.1875rem] size-5 shrink-0 cursor-pointer rounded-[0.3125rem] border-[1.5px] accent-[var(--color-terracotta)]',
            error ? 'border-terracotta' : 'border-sand',
            className,
          )}
          {...rest}
        />
        <label htmlFor={id} className="cursor-pointer font-sans text-sm leading-relaxed text-charcoal">
          {label}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="pl-8 font-sans text-sm font-medium text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
};
