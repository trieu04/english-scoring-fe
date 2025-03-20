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
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(undefined, apiErrorInterceptor);

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
