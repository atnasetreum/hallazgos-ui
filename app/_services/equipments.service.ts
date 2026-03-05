import axiosWrapper from "./axiosWrapper";
import { Equipment } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/equipments",
});

const findAll = async ({
  manufacturingPlantId,
  name = "",
}: {
  manufacturingPlantId: string;
  name?: string;
}) => {
  const { data } = await api.get<Equipment[]>("", {
    params: {
      manufacturingPlantId,
      name,
    },
  });
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<Equipment>(`/${id}`);
  return data;
};

const create = async (payload: {
  name: string;
  deliveryFrequency?: number | null;
  manufacturingPlantId: number;
}) => {
  const { data } = await api.post<Equipment>("", payload);
  return data;
};

const update = async (
  id: number,
  payload: {
    name: string;
    deliveryFrequency?: number | null;
    manufacturingPlantId: number;
  },
) => {
  const { data } = await api.patch<Equipment>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  await api.delete<Equipment>(`/${id}`);
};

export const EquipmentsService = {
  findOne,
  findAll,
  create,
  update,
  remove,
};
