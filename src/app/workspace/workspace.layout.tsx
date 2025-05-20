import { Outlet } from "@tanstack/react-router";

export function WorkspaceLayout() {
  return (
    <div>
      <h1>Workspace Layout</h1>
      <Outlet />
    </div>
  );
}
