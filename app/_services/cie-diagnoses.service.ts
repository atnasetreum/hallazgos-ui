import axiosWrapper from "./axiosWrapper";
import { CieDiagnosis } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/cie-diagnoses",
});

const findAll = async () => {
  const { data } = await api.get<CieDiagnosis[]>("");
  return data;
};

export const CieDiagnosesService = {
  findAll,
};
