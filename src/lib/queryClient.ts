import { QueryClient } from '@tanstack/react-query';

/**
 * One client for the whole app. The landing page has no authenticated
 * session to invalidate, so the defaults lean towards fewer refetches.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      // A waitlist submission is not idempotent — never retry it silently.
      retry: 0,
    },
  },
});
