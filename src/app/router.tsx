import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { NotFound } from "../components/error/not-found";
import { authRouteWithChildren } from "./auth/auth.route";
import { indexPageRoute } from "./index-page/index-page.route";
import { infomationalRouteWithChildren } from "./informational/informational.route";
import { testRoute } from "./test/test.route";
import { workspaceRouteWithChilren } from "./workspace/workspace.route";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: () => <NotFound />,
});

export const routeTree = rootRoute.addChildren([
  indexPageRoute,
  authRouteWithChildren,
  workspaceRouteWithChilren,
  infomationalRouteWithChildren,
  testRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
