/**
 * -----------------------------------------------------------------------------
 * File: ProtectedLayout.tsx
 * Layer: Layout
 *
 * Purpose:
 * Provides the application shell for authenticated pages.
 *
 * Responsibilities:
 * - Render shared authenticated UI.
 * - Render child routes using Outlet.
 *
 * Not Responsible For:
 * - Authentication logic
 * - Sidebar logic
 * - Navbar logic
 * -----------------------------------------------------------------------------
 */

import { Outlet } from "react-router-dom";

function ProtectedLayout() {
    return <Outlet />;
}

export default ProtectedLayout;