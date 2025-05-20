import { createRoute } from "@tanstack/react-router";
import { authRoute } from "../auth.route";
import { SignupPage } from "./signup";

export const signupRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "signup",
  component: SignupPage,
});
