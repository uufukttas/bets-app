import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import type{ IApiErrorProps } from '@/types/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.the-odds-api.com/v4',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const apiKey = process.env.NEXT_PUBLIC_BET_APP_API_KEY;

  config.params = {
    ...config.params,
    api_key: apiKey,
  };

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('API Error: Authentication failed. Check your API key configuration.');
    }

    return Promise.reject(error);
  }
);

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const apiError: IApiErrorProps = {
      message: axiosError.message || 'An unknown error occurred',
      status: axiosError.response?.status,
    };

    console.error('API request failed:', {
      url,
      method,
      status: axiosError.response?.status,
      message: axiosError.message,
      data: axiosError.response?.data,
    });

    throw apiError;
  }
}

export const apiGet = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiRequest<T>('GET', url, undefined, config);

export const apiPost = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  apiRequest<T>('POST', url, data, config);

export const apiPut = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  apiRequest<T>('PUT', url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiRequest<T>('DELETE', url, undefined, config);

export default api; 