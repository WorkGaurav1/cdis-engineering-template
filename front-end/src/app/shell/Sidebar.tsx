/**
 * -----------------------------------------------------------------------------
 * File: Sidebar.tsx
 * Layer: Application Shell
 *
 * Purpose:
 * Renders the application's primary navigation.
 *
 * Responsibilities:
 * - Render navigation items.
 * - Delegate navigation data to configuration.
 *
 * Not Responsible For:
 * - Route definitions.
 * - Permissions.
 * - Navigation configuration.
 * -----------------------------------------------------------------------------
 */

import { NavLink } from "react-router-dom";

import { navigationConfig, type NavigationItem } from "../../config/navigation/navigationConfig.ts";

function Sidebar() {
    return (
        <aside>
            <nav>
                <ul>
                    {navigationConfig.map((item: NavigationItem) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;