import { createRoute } from "@tanstack/react-router";
import { ContactPage } from "../contact/contact";
import { infomationalRoute } from "../informational.route";

export const aboutRoute = createRoute({
  getParentRoute: () => infomationalRoute,
  path: "contact",
  component: ContactPage,
});
