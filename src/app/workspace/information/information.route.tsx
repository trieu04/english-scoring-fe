import { createRoute } from "@tanstack/react-router";
import { workspaceRoute } from "../workspace.route";
import { InformationPage } from "./information";

export const informationRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: "information",
  component: InformationPage,
});
