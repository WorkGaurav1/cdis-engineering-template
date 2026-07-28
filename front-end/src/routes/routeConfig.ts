/**
 * -----------------------------------------------------------------------------
 * File: routeConfig.ts
 * -----------------------------------------------------------------------------
 * Purpose:
 * Centralized application route definitions.
 *
 * Responsibilities:
 * - Define application route paths.
 * - Act as the single source of truth for routing.
 *
 * Not Responsible For:
 * - Router creation.
 * - Route guards.
 * - Authentication.
 *
 * Used By:
 * - AppRouter
 * - Navigation
 * - Route Guards
 * -----------------------------------------------------------------------------
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;