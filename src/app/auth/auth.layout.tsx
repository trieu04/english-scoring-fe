import { Outlet } from "@tanstack/react-router";

export function AuthLayout() {
  return (
    <div className="bg-gray-100">
      <Outlet />
    </div>
  );
}
