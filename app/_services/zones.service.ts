import axiosWrapper from "./axiosWrapper";
import { Zone } from "@interfaces";

interface Payload {
  name: string;
  manufacturingPlantId: number;
}

const api = axiosWrapper({
  baseURL: "/zones",
});

const create = async (payload: Payload) => {
  const { data } = await api.post<Zone>("", payload);
  return data;
};

const findAll = async (filters: {
  name?: string;
  manufacturingPlantId?: string;
  manufacturingPlantNames?: string[];
  withArea?: boolean;
}) => {
  const { data } = await api.get<Zone[]>("", {
    params: {
      ...(filters?.name && {
        name: filters.name,
      }),
      ...(filters?.manufacturingPlantId && {
        manufacturingPlantId: filters.manufacturingPlantId,
      }),
      ...(filters?.manufacturingPlantNames && {
        manufacturingPlantNames: filters.manufacturingPlantNames,
      }),
      ...(filters?.withArea && {
        withArea: filters.withArea,
      }),
    },
  });
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<Zone>(`/${id}`);
  return data;
};

const update = async (id: number, payload: Payload) => {
  const { data } = await api.patch<Zone>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<Zone>(`/${id}`);
  return data;
};

export const ZonesService = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
