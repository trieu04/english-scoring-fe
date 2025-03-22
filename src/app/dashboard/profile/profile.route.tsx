import { createRoute } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard.route";
import { DashboardProfilePage } from "./profile";

export const profileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/profile",
  component: DashboardProfilePage,
});
