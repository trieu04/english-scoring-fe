import { IUser } from "@/types/user";
import { api } from "./api";

export interface LoginResponse {
  accessToken: string;
  user: IUser;
}
export interface ILoginCredentials {
  username: string;
  password: string;
}
export interface SignupResponse {
  accessToken: string;
  user: IUser;
}
export interface ISignupCredentials {
  name: string;
  email: string;
  password: string;
}

export async function loginApi(credentials: ILoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/sign-in", credentials);
  return response.data;
}

export async function googleLoginApi(code: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/google", { code });
  return response.data;
}

export async function getMeApi(): Promise<IUser> {
  const response = await api.get<IUser>("/auth/me");
  return response.data;
}

export async function signupApi(credentials: ISignupCredentials): Promise<SignupResponse> {
  const response = await api.post<SignupResponse>("/auth/sign-up", credentials);
  return response.data;
}
