import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { env } from "@/config/env.client";
import { DEFAULT_API_ERROR, DEFAULT_API_ERROR_STATUS } from "@/constants/error.constant";
import { LOCAL_STORAGE_KEY } from "@/constants/local-storage.constant";

const axiosInstance = axios.create({
  baseURL: env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface IApiError {
  message: string;
  status?: number;
  data?: any;
}

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    const apiError: IApiError = {
      ...DEFAULT_API_ERROR,
      message: error.message,
    };

    if (error.response) {
      const { status, data } = error.response;
      apiError.status = status;
      apiError.message
        = data?.message
          ?? DEFAULT_API_ERROR_STATUS[status]?.message
          ?? error.message;
      apiError.data = data;
    }
    else if (error.code === "ERR_NETWORK") {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  },
);

export class ApiService {
  protected axiosInstance: AxiosInstance = axiosInstance;

  constructor() {}

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.get<T>(url, config));
  }

  async post<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.post<T>(url, data, config));
  }

  async patch<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.patch<T>(url, data, config));
  }

  async put<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.put<T>(url, data, config));
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.extractDataFromResponse(this.axiosInstance.delete<T>(url, config));
  }

  private async extractDataFromResponse<T>(responsePromise: Promise<AxiosResponse<T>>): Promise<T> {
    const { data } = await responsePromise;
    return data;
  }
}

export const apiService = new ApiService();
