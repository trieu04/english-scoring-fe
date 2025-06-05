import { createRoute } from "@tanstack/react-router";
import { AboutPage } from "../about/about";
import { infomationalRoute } from "../informational.route";

export const contactRoute = createRoute({
  getParentRoute: () => infomationalRoute,
  path: "about",
  component: AboutPage,
});
