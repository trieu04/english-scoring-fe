import { createRoute } from "@tanstack/react-router";
import { ReportPage } from "./dashboard";
import { workspaceRoute } from "../workspace.route";

export const reportRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: "report",
  component: ReportPage,
});
