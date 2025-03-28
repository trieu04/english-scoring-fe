import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { ScoringPage } from "./scoring";

export const scoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scoring",
  component: ScoringPage,
});

scoringRoute.addChildren([]);
