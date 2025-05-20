import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { dashboardRoute } from "./dashboard/dashboard.route";
import { profileRoute } from "./profile/profile.route";
import { WorkspaceLayout } from "./workspace.layout";
import { scoringRoute } from "./scoring/scoring.route";

export const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "workspace", // pathless route
  component: WorkspaceLayout,
});

export const workspaceRouteWithChilren = workspaceRoute.addChildren([
  dashboardRoute,
  scoringRoute,
  profileRoute,
]);
