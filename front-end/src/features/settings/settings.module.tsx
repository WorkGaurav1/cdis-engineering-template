import { Settings as SettingsIcon } from "lucide-react";

import type { FeatureModule } from "@/config/navigation/featureModule";
import { ROUTE_SEGMENTS, ROUTES } from "@/routes/routeConfig";

import SettingsPage from "./pages/SettingsPage";

export const settingsModule: FeatureModule = {
  segment: ROUTE_SEGMENTS.SETTINGS,
  path: ROUTES.SETTINGS,
  element: <SettingsPage />,
  label: "Settings",
  icon: SettingsIcon,
};
