import axiosWrapper from "./axiosWrapper";
import { ManufacturingPlant } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/manufacturing-plants",
});

const findAll = async (filters: { name: string }) => {
  const { data } = await api.get<ManufacturingPlant[]>("", {
    params: {
      ...(filters.name && {
        name: filters.name,
      }),
    },
  });
  return data;
};

export const ManufacturingPlantsService = {
  findAll,
};
