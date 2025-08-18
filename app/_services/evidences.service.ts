import axios from "axios";

import axiosWrapper from "./axiosWrapper";
import { Evidence } from "_interfaces/evicences.interfaces";
import { FiltersEvidences } from "(routes)/hallazgos/_components/FiltersEvidence";

const baseURL = "/evidences";

const api = axiosWrapper({
  baseURL,
});

const paramsFilter = (params: FiltersEvidences) => {
  return {
    ...(params.manufacturingPlantId && {
      manufacturingPlantId: params.manufacturingPlantId,
    }),
    ...(params.mainTypeId && { mainTypeId: params.mainTypeId }),
    ...(params.secondaryType && { secondaryType: params.secondaryType }),
    ...(params.zone && { zone: params.zone }),
    ...(params.state && { status: params.state }),
  };
};

const findAll = async (params: FiltersEvidences) => {
  const { data } = await api.get<Evidence[]>("", {
    params: paramsFilter(params),
  });
  return data;
};

const create = async (formData: FormData) => {
  const { data } = await axios.post<Evidence>(
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

const solution = async (id: number, formData: FormData) => {
  const { data } = await axios.post<Evidence>(
    `${process.env.NEXT_PUBLIC_URL_API}${baseURL}/solution/${id}`,
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

const remove = async (id: number) => {
  const { data } = await api.delete<Evidence>(`/${id}`);
  return data;
};

const addComment = async (id: number, comment: string) => {
  const { data } = await api.post<Evidence>(`/add/comment/${id}`, { comment });
  return data;
};

export const EvidencesService = {
  findAll,
  create,
  remove,
  solution,
  addComment,
};
