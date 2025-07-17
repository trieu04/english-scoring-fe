import { testRouteTree } from "@/features/test/route";
import { createRootRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";
import { NotFound } from "../components/error/not-found";
import { authRouteTree } from "../features/auth/route";
import { indexPageRouteTree } from "../features/index-page/route";
import { informationalRouteTree } from "../features/informational/route";
import { mainAppRouteTree } from "../features/main-app/route";
import { LOCAL_STORAGE_KEY } from "@/constants/local-storage.constant";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: () => <NotFound />,
  beforeLoad: ({ location }) => {
    // Check if user is accessing root path
    if (location.pathname === "/") {
      const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      
      // If authenticated, redirect to dashboard
      if (token) {
        throw redirect({
          to: "/dashboard",
        });
      }
      // If not authenticated, redirect to login
      else {
        throw redirect({
          to: "/login",
        });
      }
    }
  },
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
