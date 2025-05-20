import { createRoute } from "@tanstack/react-router";
import { authRoute } from "../auth.route";
import { LoginPage } from "./login";

export const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "login",
  component: LoginPage,
});
