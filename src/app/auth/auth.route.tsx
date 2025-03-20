import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { AuthLayout } from "./auth.layout";
import { LoginPage } from "./login/login.index";
import { SignupPage } from "./signup/signup.index";

const _authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthLayout,
});

export const authRoute = _authRoute.addChildren([
  createRoute({
    getParentRoute: () => _authRoute,
    path: "/login",
    component: LoginPage,
  }),
  createRoute({
    getParentRoute: () => _authRoute,
    path: "/signup",
    component: SignupPage,
  }),
]);
