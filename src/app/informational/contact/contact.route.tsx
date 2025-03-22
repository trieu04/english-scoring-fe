import { createRoute } from "@tanstack/react-router";
import { AboutPage } from "../about/about";
import { infomationalLayoutRoute } from "../informational.route";

export const contactRoute = createRoute({
  getParentRoute: () => infomationalLayoutRoute,
  path: "about",
  component: AboutPage,
});
