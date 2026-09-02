import type { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AccessibilityProvider } from './AccessibilityProvider';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ErrorBoundary>
    <QueryProvider>
      <AccessibilityProvider>{children}</AccessibilityProvider>
    </QueryProvider>
  </ErrorBoundary>
);
