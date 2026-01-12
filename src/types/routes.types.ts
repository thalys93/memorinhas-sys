import { FC, ReactElement } from "react";

export type RouteItem = {
    path: string;
    element: React.ElementType;
}

export type Middleware = FC<{ children: React.ReactNode }>

export type RoutesGroup = {
    public?: RouteItem[];
    private?: RouteItem[];
    prefix?: string;
    privateMiddleware?: Middleware
}