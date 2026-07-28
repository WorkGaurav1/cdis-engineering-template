/**
 * -----------------------------------------------------------------------------
 * File: protectedRoutes.tsx
 * -----------------------------------------------------------------------------
 *
 * Layer:
 * Routing
 *
 * Purpose:
 * Defines all protected application routes.
 *
 * Responsibilities:
 * - Configure route objects for authenticated pages.
 * - Map protected routes to feature pages.
 *
 * Not Responsible For:
 * - Creating the application router.
 * - Authentication.
 * - Authorization.
 * - Route guards.
 * - Layout composition.
 *
 * Dependencies:
 * - DashboardPage
 * - ROUTES
 *
 * Consumers:
 * - AppRouter
 *
 * Pattern:
 * React Router Data Router
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// External Imports
// -----------------------------------------------------------------------------

import type { RouteObject } from "react-router-dom";

// -----------------------------------------------------------------------------
// Internal Imports
// -----------------------------------------------------------------------------

import { DashboardPage } from "../features/dashboard";
import { ROUTES } from "./routeConfig";

// -----------------------------------------------------------------------------
// Protected Route Definitions
// -----------------------------------------------------------------------------

export const protectedRoutes: RouteObject[] = [
    {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
    },
];