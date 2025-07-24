import { redirect } from "@tanstack/react-router";
import { LOCAL_STORAGE_KEY } from "@/constants/local-storage.constant";

export function requireAuth() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

  if (!token) {
    throw redirect({
      to: "/login",
      search: {
        redirect: window.location.pathname + window.location.search,
      },
    });
  }
}

export function requireGuest() {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

  if (token) {
    throw redirect({
      to: "/dashboard",
    });
  }
}
