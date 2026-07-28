/**
 * -----------------------------------------------------------------------------
 * File: AppRouter.tsx
 * -----------------------------------------------------------------------------
 *
 * Layer:
 * Routing
 *
 * Purpose:
 * Creates and provides the application's router.
 *
 * Responsibilities:
 * - Create the React Router instance.
 * - Compose public and protected routes.
 * - Register fallback routes.
 * - Provide routing to the application.
 *
 * Not Responsible For:
 * - Authentication.
 * - Authorization.
 * - Layout composition.
 * - Business logic.
 *
 * Dependencies:
 * - publicRoutes
 * - protectedRoutes
 * - NotFoundPage
 *
 * Consumers:
 * - App.tsx
 *
 * Pattern:
 * React Router Data Router
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// External Imports
// -----------------------------------------------------------------------------

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

// -----------------------------------------------------------------------------
// Internal Imports
// -----------------------------------------------------------------------------

import { publicRoutes } from "./publicRoutes";
import { protectedRoutes } from "./protectedRoutes";
import NotFoundPage from "../shared/pages/NotFoundPage";

// -----------------------------------------------------------------------------
// Router Configuration
// -----------------------------------------------------------------------------

const router = createBrowserRouter([
    ...publicRoutes,

    ...protectedRoutes,

    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;