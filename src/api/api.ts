import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { env } from "../config/env.client";
import { DEFAULT_API_ERROR, DEFAULT_API_ERROR_STATUS } from "../constants/error.constant";
import { LOCAL_STORAGE_KEY } from "../constants/local-storage.constant";

export interface IApiError {
  message: string;
  status?: number;
  data?: any;
}

export const api = Axios.create({
  baseURL: env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export const mockApi = Axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.request.use(mocksDelayInterceptor);
api.interceptors.response.use(undefined, apiErrorInterceptor);

mockApi.interceptors.request.use(authRequestInterceptor);
mockApi.interceptors.request.use(mocksDelayInterceptor);
mockApi.interceptors.response.use(undefined, apiErrorInterceptor);

function mocksDelayInterceptor(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  if (config.url?.startsWith("/mocks")) {
    return new Promise(resolve => setTimeout(() => resolve(config), 500 + Math.random() * 500));
  }
  return Promise.resolve(config);
}

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}

function apiErrorInterceptor(error: AxiosError<any>) {
  const apiError: IApiError = Object.assign({}, DEFAULT_API_ERROR);

  apiError.message = error.message;

  const { response } = error;
  if (response) {
    const status = response.status;

    apiError.status = status;

    apiError.message
      = response.data?.message
        ?? DEFAULT_API_ERROR_STATUS[status]?.message
        ?? apiError.message;

    apiError.data = response.data;
  }

  if (error.code === "ERR_NETWORK") {
    apiError.message = error.message;
  }

  return Promise.reject(apiError);
}
