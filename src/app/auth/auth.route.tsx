import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { AuthLayout } from "./auth.layout";
import { loginRoute } from "./login/login.route";
import { signupRoute } from "./signup/signup.route";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
});

export const authRouteWithChildren = authRoute.addChildren([
  loginRoute,
  signupRoute,
]);
