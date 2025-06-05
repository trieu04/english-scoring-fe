import { createRoute } from "@tanstack/react-router";
import { workspaceRoute } from "../workspace.route";
import { ScoringPage } from "./scoring";

export const scoringRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: "scoring",
  component: ScoringPage,
  validateSearch: (search) => {
    return {
      exam: search.exam ?? undefined,
    };
  },
});
