import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { AboutPage } from "./about";
import { ContactPage } from "./contact";
import { InfomationalLayout } from "./informational.layout";

const _infomationalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/i",
  component: InfomationalLayout,
});

export const infomationalRoute = _infomationalRoute.addChildren([
  createRoute({
    getParentRoute: () => _infomationalRoute,
    path: "/about",
    component: AboutPage,
  }),
  createRoute({
    getParentRoute: () => _infomationalRoute,
    path: "/contact",
    component: ContactPage,
  }),
]);
