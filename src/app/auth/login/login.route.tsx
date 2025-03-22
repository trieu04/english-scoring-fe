import { createRoute } from "@tanstack/react-router";
import { authLayoutRoute } from "../auth.route";
import { LoginPage } from "./login";

export const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "login",
  component: LoginPage,
});
