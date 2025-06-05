import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { dashboardRoute } from "./dashboard/dashboard.route";
import { historyRoute } from "./history/history.route";
import { informationRoute } from "./information/information.route";
import { profileRoute } from "./profile/profile.route";
import { reportRoute } from "./report/dashboard.route";
import { scoringRoute } from "./scoring/scoring.route";
import { settingsRoute } from "./settings/settings.route";
import { uploadRoute } from "./upload/upload.route";
import { WorkspaceLayout } from "./workspace.layout";

export const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "workspace", // pathless route
  component: WorkspaceLayout,
});

export const workspaceRouteWithChilren = workspaceRoute.addChildren([
  dashboardRoute,
  scoringRoute,
  profileRoute,
  uploadRoute,
  historyRoute,
  informationRoute,
  reportRoute,
  settingsRoute,
]);
