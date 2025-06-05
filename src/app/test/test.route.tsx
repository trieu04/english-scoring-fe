import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { TestPage } from "./test";

export const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/test",
  component: TestPage,
});
