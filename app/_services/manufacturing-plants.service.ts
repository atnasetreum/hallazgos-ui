import axiosWrapper from "./axiosWrapper";
import { ManufacturingPlant } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/manufacturing-plants",
});

const create = async (payload: ManufacturingPlant) => {
  const { data } = await api.post<ManufacturingPlant>("", payload);
  return data;
};

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

const findOne = async (id: number) => {
  const { data } = await api.get<ManufacturingPlant>(`/${id}`);
  return data;
};

const update = async (id: number, payload: ManufacturingPlant) => {
  const { data } = await api.put<ManufacturingPlant>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<ManufacturingPlant>(`/${id}`);
  return data;
};

export const ManufacturingPlantsService = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
