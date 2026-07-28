/**
 * -----------------------------------------------------------------------------
 * File: navigationConfig.ts
 * -----------------------------------------------------------------------------
 *
 * Layer:
 * Configuration
 *
 * Purpose:
 * Centralize all application navigation definitions.
 *
 * Responsibilities:
 * - Define the navigation model.
 * - Define sidebar navigation items.
 * - Provide a single source of truth for application navigation.
 *
 * Not Responsible For:
 * - Rendering navigation.
 * - Routing.
 * - Authentication.
 * - Authorization.
 *
 * Dependencies:
 * - ROUTES
 *
 * Consumers:
 * - Sidebar
 * - Breadcrumbs
 * - Mobile Navigation
 * - Future Permission Guards
 *
 * Pattern:
 * Centralized Navigation Configuration
 * -----------------------------------------------------------------------------
 */

import { ROUTES } from "../../routes/routeConfig";

/**
 * -----------------------------------------------------------------------------
 * Navigation Item
 * -----------------------------------------------------------------------------
 *
 * Represents one navigable item inside the application.
 * -----------------------------------------------------------------------------
 */

export interface NavigationItem {
    label: string;
    path: string;
    icon?: string;
    permission?: string;
    children?: NavigationItem[];
}

/**
 * -----------------------------------------------------------------------------
 * Navigation Configuration
 * -----------------------------------------------------------------------------
 */

export const navigationConfig: NavigationItem[] = [
    {
        label: "Dashboard",
        path: ROUTES.DASHBOARD,
    },
    {
        label: "Users",
        path: ROUTES.USERS,
    },
    {
        label: "Settings",
        path: ROUTES.SETTINGS,
    },
];