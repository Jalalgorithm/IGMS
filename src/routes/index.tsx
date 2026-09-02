import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '@/features/landing';
import { PolicyPage } from '@/features/legal';
import { NotFound } from './NotFound';

/**
 * The public site is one scrolling page plus the Termageddon-hosted policies,
 * which get real URLs because people link to and bookmark them. New features
 * add their route object here and keep their screen inside the feature
 * folder — there is no shared pages/ layer.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/:slug',
    element: <PolicyPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
