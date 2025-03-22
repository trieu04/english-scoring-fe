import { createRoute } from "@tanstack/react-router";
import { ContactPage } from "../contact/contact";
import { infomationalLayoutRoute } from "../informational.route";

export const aboutRoute = createRoute({
  getParentRoute: () => infomationalLayoutRoute,
  path: "contact",
  component: ContactPage,
});
