import axios from "axios";

import axiosWrapper from "./axiosWrapper";
import { Evidence } from "_interfaces/evicences.interfaces";
import { FiltersEvidences } from "(routes)/hallazgos/_components/FiltersEvidence";

const baseURL = "/evidences";

const api = axiosWrapper({
  baseURL,
});

const findAll = async (params: FiltersEvidences) => {
  const { data } = await api.get<Evidence[]>("", {
    params: {
      ...(params.manufacturingPlantId && {
        manufacturingPlantId: params.manufacturingPlantId,
      }),
      ...(params.mainTypeId && { mainTypeId: params.mainTypeId }),
      ...(params.secondaryType && { secondaryType: params.secondaryType }),
      ...(params.zone && { zone: params.zone }),
    },
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

export const EvidencesService = {
  findAll,
  create,
  solution,
};
