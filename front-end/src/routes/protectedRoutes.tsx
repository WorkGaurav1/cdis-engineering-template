import type { RouteObject } from "react-router-dom";

import { DashboardPage } from "../features/dashboard";
import { ProtectedLayout } from "../layouts";
import { ROUTE_SEGMENTS } from "./routeConfig";

export const protectedRoutes: RouteObject[] = [
    {
        element: <ProtectedLayout />,
        children: [
            {
                path: ROUTE_SEGMENTS.DASHBOARD,
                element: <DashboardPage />,
            },
        ],
    },
];