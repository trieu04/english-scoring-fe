import { IUser } from "@/types/user";
import { api } from "./api";

export interface ILoginResponse {
  accessToken: string;
  user: IUser;
}
export interface ILoginCredentials {
  username: string;
  password: string;
}
export interface ISignupResponse {
  accessToken: string;
  user: IUser;
}
export interface ISignupCredentials {
  name: string;
  email: string;
  password: string;
}

export async function loginApi(credentials: ILoginCredentials) {
  const response = await api.post<ILoginResponse>("/auth/sign-in", credentials);
  return response.data;
}

export async function googleLoginApi(code: string) {
  const response = await api.post<ILoginResponse>("/auth/google", { code });
  return response.data;
}

export async function getProfileApi(): Promise<IUser> {
  const response = await api.get<IUser>("/auth/me");
  return response.data;
}

export async function signupApi(credentials: ISignupCredentials) {
  const response = await api.post<ISignupResponse>("/auth/sign-up", credentials);
  return response.data;
}
