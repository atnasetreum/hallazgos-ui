import axiosWrapper from "./axiosWrapper";
import { SecondaryType } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/secondary-types",
});

const findAllByManufacturingPlant = async (id: number) => {
  const { data } = await api.get<SecondaryType[]>(
    `/by/manufacturing-plant/${id}`
  );
  return data;
};

const findAll = async () => {
  const { data } = await api.get<SecondaryType[]>("");
  return data;
};

export const SecondaryTypesService = {
  findAll,
  findAllByManufacturingPlant,
};
