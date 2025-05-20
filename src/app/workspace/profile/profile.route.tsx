import { createRoute } from "@tanstack/react-router";
import { workspaceRoute } from "../workspace.route";
import { DashboardProfilePage } from "./profile";

export const profileRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: "profile",
  component: DashboardProfilePage,
});
