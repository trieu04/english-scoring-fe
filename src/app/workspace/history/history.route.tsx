import { createRoute } from "@tanstack/react-router";
import { workspaceRoute } from "../workspace.route";
import { HistoryPage } from "./history";

export const historyRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: "history",
  component: HistoryPage,
});
