/**
 * -----------------------------------------------------------------------------
 * File: publicRoutes.tsx
 * -----------------------------------------------------------------------------
 * Purpose:
 * Defines all publicly accessible application routes.
 *
 * Responsibilities:
 * - Configure route objects for pages that do not require authentication.
 * - Map route paths to feature pages.
 *
 * Not Responsible For:
 * - Creating the application router.
 * - Authentication or authorization.
 * - Route guards.
 * - Layout composition.
 *
 * Used By:
 * - AppRouter
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// External Imports
// -----------------------------------------------------------------------------

import type { RouteObject } from "react-router-dom";

import { PublicLayout } from "../layouts";
import { LoginPage } from "../features/auth";
import { ROUTES } from "./routeConfig";

export const publicRoutes: RouteObject[] = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <LoginPage />,
            },
        ],
    },
];