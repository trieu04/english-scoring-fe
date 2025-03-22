import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { aboutRoute } from "./about/about.route";
import { contactRoute } from "./contact/contact.route";
import { InfomationalLayout } from "./informational.layout";

export const infomationalLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "infomational",
  component: InfomationalLayout,
});

infomationalLayoutRoute.addChildren([aboutRoute, contactRoute]);
