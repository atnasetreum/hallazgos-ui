import axios from "axios";

import axiosWrapper from "./axiosWrapper";
import { Evidence } from "_interfaces/evicences.interfaces";

const baseURL = "/evidences";

const api = axiosWrapper({
  baseURL,
});

const findAll = async () => {
  const { data } = await api.get("");
  return data;
};

const create = async (formData: FormData) => {
  const { data } = await axios.post<Evidence[]>(
    `${process.env.NEXT_PUBLIC_URL_API}${baseURL}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ["x-app-key"]: process.env.NEXT_PUBLIC_APP_KEY,
      },
      withCredentials: true,
    }
  );
  return data;
};

export const EvidencesService = {
  findAll,
  create,
};
