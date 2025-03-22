import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { AuthLayout } from "./auth.layout";
import { signupRoute } from "./signup/signup.route";
import { loginRoute } from "./login/login.route";

export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
});

authLayoutRoute.addChildren([
  signupRoute,
  loginRoute,
]);
