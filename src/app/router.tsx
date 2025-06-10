import { testRouteTree } from "@/features/test/route";
import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { NotFound } from "../components/error/not-found";
import { authRouteTree } from "../features/auth/route";
import { indexPageRouteTree } from "../features/index-page/route";
import { informationalRouteTree } from "../features/informational/route";
import { mainAppRouteTree } from "../features/main-app/route";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: () => <NotFound />,
});

export const routeTree = rootRoute.addChildren([
  indexPageRouteTree,
  authRouteTree,
  mainAppRouteTree,
  informationalRouteTree,
  testRouteTree,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
