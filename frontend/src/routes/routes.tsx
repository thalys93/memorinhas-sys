import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import type { RoutesGroup } from '@/types/routes.types';
import { AllRoutes, NotFoundPage } from './map';

function applyPrefix(prefix: string | undefined, path: string) {
  const base = prefix ? `/${prefix.replace(/^\/+|\/+$/g, '')}` : '';
  const segment = path ? `/${path.replace(/^\/+/, '')}` : '';
  const full = `${base}${segment}`.replace(/\/+/g, '/');
  return full === '' ? '/' : full.replace(/\/$/, '') || '/';
}

function renderAllRoutes() {
  const elements: ReactElement[] = [];

  for (const group of AllRoutes as RoutesGroup[]) {
    const {
      public: pub = [],
      private: priv = [],
      prefix,
      publicMiddleware,
      privateMiddleware,
    } = group;

    const publicWithLayout = pub.length > 0 && publicMiddleware;
    const publicWithoutLayout = pub.length > 0 && !publicMiddleware;

    if (publicWithLayout) {
      const PublicLayout = publicMiddleware;
      const parentPath = applyPrefix(prefix, '');

      elements.push(
        <Route key={`${parentPath}-public`} path={parentPath} element={<PublicLayout />}>
          {pub.map((route) => (
            <Route
              key={route.path || 'index'}
              index={route.path === ''}
              path={route.path !== '' ? route.path : undefined}
              element={<route.element />}
            />
          ))}
        </Route>,
      );
    }

    if (publicWithoutLayout) {
      for (const route of pub) {
        const fullPath = applyPrefix(prefix, route.path);
        const Element = route.element;
        elements.push(<Route key={fullPath} path={fullPath} element={<Element />} />);
      }
    }

    if (priv.length > 0 && privateMiddleware) {
      const PrivateLayout = privateMiddleware;
      const parentPath = applyPrefix(prefix, '');

      elements.push(
        <Route key={`${parentPath}-private`} path={parentPath} element={<PrivateLayout />}>
          {priv.map((route) => (
            <Route
              key={route.path || 'index'}
              index={route.path === ''}
              path={route.path !== '' ? route.path : undefined}
              element={<route.element />}
            />
          ))}
        </Route>,
      );
    }
  }

  return elements;
}

const routeElements = renderAllRoutes();

export default function AppRoutes() {
  return (
    <Routes>
      {routeElements}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
