import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/classNames';

/**
 * Button hierarchy, defined once:
 *   primary   — Donate and the main hero CTA. Solid terracotta, ivory text.
 *   secondary — in-page anchor CTAs. Outlined.
 *   tertiary  — outbound links. Underlined text, never a button shape, so it
 *               is visibly different from anything that keeps you on the page.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'secondary-on-dark' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'rounded-full bg-terracotta text-ivory hover:bg-terracotta-dark',
  secondary:
    'rounded-full border-[1.5px] border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory',
  'secondary-on-dark':
    'rounded-full border-[1.5px] border-ivory text-ivory hover:bg-ivory hover:text-charcoal',
  tertiary:
    'font-semibold text-terracotta underline underline-offset-4 decoration-[1.5px] hover:text-charcoal hover:decoration-charcoal',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-[0.9375rem]',
  lg: 'px-8 py-4 text-base',
};

const classesFor = (variant: ButtonVariant, size: ButtonSize, className?: string): string =>
  cn(BASE, VARIANTS[variant], variant === 'tertiary' ? 'text-sm' : SIZES[size], className);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) => (
  <button type={type} className={classesFor(variant, size, className)} {...rest}>
    {children}
  </button>
);

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Adds the rel/target pair and a trailing arrow for outbound links. */
  external?: boolean;
  children: ReactNode;
}

export const LinkButton = ({
  variant = 'primary',
  size = 'md',
  external = false,
  className,
  children,
  ...rest
}: LinkButtonProps) => (
  <a
    className={cn(classesFor(variant, size, className), 'no-underline', variant === 'tertiary' && 'underline')}
    {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    {...rest}
  >
    {children}
    {external ? <span aria-hidden="true">&rarr;</span> : null}
    {external ? <span className="sr-only">(opens in a new tab)</span> : null}
  </a>
);
