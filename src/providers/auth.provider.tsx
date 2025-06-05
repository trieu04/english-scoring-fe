import { localAccessToken } from "@/storage/local";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { getProfileApi, ILoginCredentials, ILoginResponse, ISignupCredentials, loginApi, signupApi } from "../api/auth.api";
import { IUser } from "../types/user";

export interface IAuthContext {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (credentials: ILoginCredentials) => Promise<ILoginResponse>;
  signup: (credentials: ISignupCredentials) => Promise<ILoginResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: user, isLoading, refetch: refetchUser } = useQuery<IUser | null>({
    queryKey: ["auth_user"],
    queryFn: () => getProfileApi(),
    initialData: null,
  });

  const loginMutation = useMutation({
    mutationFn: (credential: ILoginCredentials) => loginApi(credential),
    onSuccess: (data) => {
      localAccessToken.set(data.accessToken);
      setIsLoggedIn(true);
      refetchUser();

      return data;
    },
  });

  const signupMutation = useMutation({
    mutationFn: (credential: ISignupCredentials) => signupApi(credential),
    onSuccess: (data) => {
      localAccessToken.set(data.accessToken);
      setIsLoggedIn(true);
      refetchUser();

      return data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => { },
    onSuccess: () => {
      localAccessToken.remove();
      queryClient.setQueryData(["auth_user"], null);
      setIsLoggedIn(false);
    },
  });

  const login = useCallback(
    (credentials: ILoginCredentials) => loginMutation.mutateAsync(credentials),
    [loginMutation],
  );

  const logout = useCallback(
    () => logoutMutation.mutateAsync(),
    [logoutMutation],
  );

  const signup = useCallback(
    (credentials: ISignupCredentials) => signupMutation.mutateAsync(credentials),
    [signupMutation],
  );

  const authContextValue = useMemo(
    () => ({ user, isLoggedIn, isLoading, login, logout, signup }),
    [user, isLoggedIn, isLoading, login, logout, signup],
  );

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
