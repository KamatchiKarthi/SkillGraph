import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout';
import { LoadingState } from '../shared/ui/state-panel';

const HomePage = lazy(() =>
  import('../pages/home.page').then((module) => ({ default: module.HomePage })),
);
const ExplorePage = lazy(() =>
  import('../pages/explore.page').then((module) => ({ default: module.ExplorePage })),
);
const PersonPage = lazy(() =>
  import('../pages/person.page').then((module) => ({ default: module.PersonPage })),
);
const PathFinderPage = lazy(() =>
  import('../pages/path-finder.page').then((module) => ({
    default: module.PathFinderPage,
  })),
);

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingState label="Loading page…" />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'explore', element: withSuspense(<ExplorePage />) },
      { path: 'people/:id', element: withSuspense(<PersonPage />) },
      { path: 'paths', element: withSuspense(<PathFinderPage />) },
    ],
  },
]);
