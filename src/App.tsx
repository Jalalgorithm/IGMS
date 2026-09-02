import { AccessibilityWidget } from '@/features/accessibility';
import { SkipLink } from '@/components/shared/SkipLink';
import { AppProviders } from '@/providers/AppProviders';
import { AppRoutes } from '@/routes';

export const App = () => (
  <AppProviders>
    <SkipLink />
    <AppRoutes />
    <AccessibilityWidget />
  </AppProviders>
);
