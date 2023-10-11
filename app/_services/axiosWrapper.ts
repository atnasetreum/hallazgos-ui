import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { notify } from "@shared/utils";

const DEFAULT_ERROR_MESSAGE =
  "Se produjo un error al procesar su solicitud, inténtelo nuevamente más tarde.";

interface IErrorResponse {
  message: string;
}

interface IAxiosWrapperProps {
  baseURL: string;
}

const axiosWrapper = ({ baseURL }: IAxiosWrapperProps): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_API + baseURL,
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = "application/json";
    config.headers["x-app-key"] = process.env.NEXT_PUBLIC_APP_KEY;

    config.withCredentials = true;

    return config;
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<IErrorResponse>) => {
      const message = error?.response?.data?.message || DEFAULT_ERROR_MESSAGE;

      if (error?.response?.status === 401) {
        if (window.location.pathname !== "/") {
          window.location.replace("/");
          return notify(message);
        }
      }

      notify(message);

      return Promise.reject(error);
    }
  );

  return api;
};

export default axiosWrapper;
