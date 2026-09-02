import { cn } from '@/utils/classNames';

interface LoadingProps {
  label?: string;
  className?: string;
  /** Inline spinners sit inside buttons; block spinners get their own row. */
  inline?: boolean;
}

export const Loading = ({ label = 'Loading', className, inline = false }: LoadingProps) => (
  <span
    role="status"
    className={cn(inline ? 'inline-flex items-center gap-2' : 'flex items-center justify-center gap-3 py-8', className)}
  >
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
    <span className={inline ? 'sr-only' : 'font-sans text-sm text-warm-grey'}>{label}</span>
  </span>
);
