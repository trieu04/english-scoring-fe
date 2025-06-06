import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../providers/auth.provider";
import { ConfigProvider } from "antd";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
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
            },
          }}
        >
          {children}
        </ConfigProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
