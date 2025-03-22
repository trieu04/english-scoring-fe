import { createRoute } from "@tanstack/react-router";
import { dashboardLayoutRoute } from "../dashboard.route";
import { DashboardIndexPage } from "./dashboard-index";

export const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: DashboardIndexPage,
});
