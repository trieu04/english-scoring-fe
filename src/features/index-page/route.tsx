import { IndexPage } from "@/features/index-page/index.page";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../app/router";

const indexPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexPage,
});

export const indexPageRouteTree = indexPageRoute.addChildren([]);
