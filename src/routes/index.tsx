import { createBrowserRouter, Outlet, ScrollRestoration } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { AdminExportPage } from '@/features/admin';
import { LandingPage } from '@/features/landing';
import { PolicyPage } from '@/features/legal';
import { ReportPage, StreetWorksPage } from '@/features/streetWorks';
import { NotFound } from './NotFound';

/**
 * Every route sits under this one so that moving to a new page starts at the
 * top, while Back returns to where you were — without it, the browser kept
 * the previous page's scroll position and new pages opened at the footer.
 */
const RootLayout = () => (
  <>
    <ScrollRestoration />
    <Outlet />
  </>
);

/**
 * The public site is one scrolling page, the street works project pages, the
 * staff downloads page, and the Termageddon-hosted policies. New features add
 * their route here and keep their screen inside the feature folder — there is
 * no shared pages/ layer.
 */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <LandingPage /> },
      // Specific pages first: '/:slug' below would otherwise treat them as policies.
      { path: '/street-works', element: <StreetWorksPage /> },
      { path: '/report-street-works', element: <ReportPage /> },
      { path: '/admin', element: <AdminExportPage /> },
      { path: '/:slug', element: <PolicyPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
