import { Navigate, type RouteObject } from "react-router-dom";

import { LoginPage } from "../features/auth";
import { PublicLayout } from "../layouts";
import { ROUTE_SEGMENTS, ROUTES } from "./routeConfig";

export const publicRoutes: RouteObject[] = [
    {
        path: ROUTES.HOME,
        element: <Navigate to={ROUTES.LOGIN} replace />,
    },
    {
        element: <PublicLayout />,
        children: [
            {
                path: ROUTE_SEGMENTS.LOGIN,
                element: <LoginPage />,
            },
        ],
    },
];