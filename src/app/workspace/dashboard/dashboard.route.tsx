import { createRoute } from "@tanstack/react-router";
import { workspaceRoute } from "../workspace.route";
import { DashboardPage } from "./dashboard";

export const dashboardRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: "dashboard",
  component: DashboardPage,
});
