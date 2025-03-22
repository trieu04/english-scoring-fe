import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsInProd } from "@tanstack/react-router-devtools";
import { NotFound } from "../components/error/not-found";
import { authLayoutRoute } from "./auth/auth.route";
import { dashboardLayoutRoute } from "./dashboard/dashboard.route";
import { indexPageRoute } from "./index-page/index-page.route";
import { infomationalLayoutRoute } from "./informational/informational.route";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtoolsInProd />
    </>
  ),
  notFoundComponent: () => <NotFound />,
});

export const routeTree = rootRoute.addChildren([
  indexPageRoute,
  dashboardLayoutRoute,
  authLayoutRoute,
  infomationalLayoutRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
