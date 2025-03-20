import { Outlet } from "@tanstack/react-router";

export function DashboardLayout() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Outlet />
    </div>
  );
}
