import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { DashboardLayout } from "./dashboard.layout";
import { dashboardIndexRoute } from "./dashboard-index/dashboard-index.route";
import { profileRoute } from "./profile/profile.route";

export const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayout,
});

dashboardLayoutRoute.addChildren([dashboardIndexRoute, profileRoute]);
