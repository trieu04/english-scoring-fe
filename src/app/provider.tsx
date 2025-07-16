import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ConfigProvider } from "antd";
import { AuthProvider } from "../features/auth/context";
import { router } from "./router";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "Helvetica, sans-serif",
              fontSize: 16,
              colorPrimary: "#3881A2",
            },
          }}
        >
          {children}
          <TanStackRouterDevtools initialIsOpen={false} router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </ConfigProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
