import type { FC, ReactNode } from 'react';

export type RouteItem = {
  path: string;
  element: React.ElementType;
};

export type Middleware = FC<{ children: ReactNode }>;

export type RoutesGroup = {
  prefix?: string;
  public?: RouteItem[];
  private?: RouteItem[];
  publicMiddleware?: FC;
  privateMiddleware?: FC;
};
