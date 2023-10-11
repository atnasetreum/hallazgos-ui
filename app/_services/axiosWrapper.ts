import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { notify } from "@shared/utils";

const DEFAULT_ERROR_MESSAGE =
  "An error occurred while processing your request. Please try again later.";

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
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<IErrorResponse>) => {
      if (error?.response?.status === 401) {
        if (window.location.pathname !== "/users/sign_in") {
          notify("The session has expired, please log in again");
        }
      } else {
        const message = error?.message || DEFAULT_ERROR_MESSAGE;

        notify(message.toString());
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default axiosWrapper;
