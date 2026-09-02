import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    // Swap for a real reporter when one exists.
    console.error('[IGMS] Unhandled render error', error, info.componentStack);
  }

  private readonly handleReset = (): void => {
    this.setState({ error: null });
  };

  public render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (!error) return children;
    if (fallback) return fallback;

    return (
      <div
        role="alert"
        className="mx-auto flex max-w-xl flex-col items-start gap-6 px-6 py-24 text-charcoal"
      >
        <h1 className="m-0 font-display text-3xl font-semibold text-terracotta">
          Something went wrong on this page.
        </h1>
        <p className="m-0 font-sans text-base leading-relaxed">
          The rest of the site is unaffected. Reloading usually clears it — if it keeps
          happening, please let us know what you were doing at the time.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={this.handleReset}>Try again</Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Reload the page
          </Button>
        </div>
      </div>
    );
  }
}
