import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsInProd } from "@tanstack/react-router-devtools";
import { NotFound } from "../components/error/not-found";
import { authRoute } from "./auth/auth.route";
import { dashboardRoute } from "./dashboard/dashboard.route";
import { indexPageRoute } from "./index-page/index-page.route";

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
  dashboardRoute,
  authRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
