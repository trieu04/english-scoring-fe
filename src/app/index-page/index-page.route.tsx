import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { LandingPage } from "./landing-page";

export const indexPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});
