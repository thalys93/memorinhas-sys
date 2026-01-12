import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AllRoutes } from './routes/map';

const App: React.FC = () => {
  // Initialize data if not present
  useEffect(() => {
    if (!localStorage.getItem('memorinhas_config')) {
      const defaultConfig = {
        kits: [
          { quantity: 3, price: 29.99 },
          { quantity: 5, price: 44.99 },
          { quantity: 10, price: 79.99 },
          { quantity: 15, price: 119.99 },
        ],
        shipping: {
          localPrefix: '92',
          localRate: 5.00,
          standardRate: 15.00,
          regions: 'Canoas, Porto Alegre, RS'
        }
      };
      localStorage.setItem('memorinhas_config', JSON.stringify(defaultConfig));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {AllRoutes.map((group: any) => {
          const prefix = group.prefix === '/' ? '' : group.prefix;

          // Se houver um layout/portal pai para o grupo
          const Layout = group.layout;

          if (Layout) {
            return (
              <Route key={prefix} path={prefix} element={<Layout />}>
                {group.pages?.map((route: any) => (
                  <Route
                    key={route.path}
                    index={route.path === ""}
                    path={route.path !== "" ? route.path : undefined}
                    element={<route.element />}
                  />
                ))}
                {/* Catch-all para o grupo */}
                <Route path="*" element={<Navigate to={prefix} replace />} />
              </Route>
            );
          }

          return (
            <React.Fragment key={prefix}>
              {group.public?.map((route: any) => {
                const path = route.path === '' ? '' : (route.path.startsWith('/') ? route.path : `/${route.path}`);
                const fullPath = `${prefix}${path}` || '/';
                return (
                  <Route
                    key={fullPath}
                    path={fullPath}
                    element={<route.element />}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
