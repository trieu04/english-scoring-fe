import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../router";
import { DashboardPage } from "./dashboard";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "dashboard",
  component: DashboardPage,
});
