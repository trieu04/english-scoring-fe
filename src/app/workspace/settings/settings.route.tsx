import { createRoute } from "@tanstack/react-router";
import { workspaceRoute } from "../workspace.route";
import { SettingsPage } from "./settings";

export const settingsRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: "settings",
  component: SettingsPage,
});
