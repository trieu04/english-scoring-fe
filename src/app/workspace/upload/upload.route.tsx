import { createRoute } from "@tanstack/react-router";
import { workspaceRoute } from "../workspace.route";
import { UploadPage } from "./upload";

export const uploadRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: "upload",
  component: UploadPage,
});
