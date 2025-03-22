import { createRoute } from "@tanstack/react-router";
import { authLayoutRoute } from "../auth.route";
import { SignupPage } from "./signup";

export const signupRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "signup",
  component: SignupPage,
});
