/**
 * -----------------------------------------------------------------------------
 * File: routeConfig.ts
 * -----------------------------------------------------------------------------
 *
 * Layer:
 * Routing
 *
 * Purpose:
 * Centralize all application route definitions.
 *
 * Responsibilities:
 * - Define reusable route segments.
 * - Define complete application URLs.
 * - Provide a single source of truth for routing.
 *
 * Not Responsible For:
 * - Creating the router.
 * - Route guards.
 * - Authentication.
 * - Authorization.
 * - Navigation rendering.
 *
 * Dependencies:
 * - None
 *
 * Consumers:
 * - AppRouter
 * - publicRoutes
 * - protectedRoutes
 * - Navigation Configuration
 * - Route Guards
 *
 * Pattern:
 * Centralized Route Configuration
 * -----------------------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------------------
 * Route Segments
 * -----------------------------------------------------------------------------
 *
 * Used when defining nested routes.
 * -----------------------------------------------------------------------------
 */

export const ROUTE_SEGMENTS = {
    LOGIN: "login",

    DASHBOARD: "dashboard",
    USERS: "users",
    SETTINGS: "settings",
} as const;

/**
 * -----------------------------------------------------------------------------
 * Absolute Application Routes
 * -----------------------------------------------------------------------------
 *
 * Used everywhere outside router configuration.
 * -----------------------------------------------------------------------------
 */

export const ROUTES = {
    HOME: "/",

    LOGIN: `/${ROUTE_SEGMENTS.LOGIN}`,

    DASHBOARD: `/${ROUTE_SEGMENTS.DASHBOARD}`,
    USERS: `/${ROUTE_SEGMENTS.USERS}`,
    SETTINGS: `/${ROUTE_SEGMENTS.SETTINGS}`,
} as const;