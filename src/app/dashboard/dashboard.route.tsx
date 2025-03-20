import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { DashboardLayout } from "./dashboard.layout";
import { DashboardProfilePage } from "./profile";

const _dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayout,
});

export const dashboardRoute = _dashboardRoute.addChildren([
  createRoute({
    getParentRoute: () => _dashboardRoute,
    path: "/profile",
    component: DashboardProfilePage,
  }),
]);
