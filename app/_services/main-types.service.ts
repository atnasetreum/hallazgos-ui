import axiosWrapper from "./axiosWrapper";
import { MainType } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/main-types",
});

const findAll = async () => {
  const { data } = await api.get<MainType[]>("");
  return data;
};

export const MainTypesService = {
  findAll,
};
