import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { getMeApi, LoginResponse } from "../api/auth.api";
import { LOCAL_STORAGE_KEY } from "../constants/local-storage.constant";
import { IUser } from "../types/user";

type LoginFn = () => Promise<LoginResponse>;
type LogoutFn = () => Promise<any>;
export interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  login: (loginFn: LoginFn) => Promise<LoginResponse>;
  logout: (logoutFn?: LogoutFn) => Promise<any>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<IUser | null>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      if (!storedToken)
        return null;
      const data = await getMeApi();
      return data;
    },
    initialData: null,
  });

  const loginMutation = useMutation({
    mutationFn: async (loginFn: LoginFn) => loginFn(),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.accessToken);
      queryClient.setQueryData(["auth", "user"], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async (logoutFn: LogoutFn) => logoutFn(),
    onSuccess: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      queryClient.setQueryData(["auth", "user"], null);
    },
  });

  const loginUser = useCallback(async (loginFn: LoginFn) => {
    return await loginMutation.mutateAsync(loginFn);
  }, [loginMutation]);

  const logoutUser = useCallback(async (logoutFn: LogoutFn = () => Promise.resolve(null)) => {
    return await logoutMutation.mutateAsync(logoutFn);
  }, [logoutMutation]);

  const authContextValue = useMemo(() => {
    return {
      user,
      isLoading,
      login: loginUser,
      logout: logoutUser,
    };
  }, [user, isLoading, loginUser, logoutUser]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
