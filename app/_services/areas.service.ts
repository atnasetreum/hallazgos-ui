import axiosWrapper from "./axiosWrapper";
import { Area } from "@interfaces";

interface Payload {
  name: string;
}

const api = axiosWrapper({
  baseURL: "/areas",
});

const create = async (payload: Payload) => {
  const { data } = await api.post<Area>("", payload);
  return data;
};

const findAll = async (filters: { name?: string }) => {
  const { data } = await api.get<Area[]>("", {
    params: {
      ...(filters?.name && {
        name: filters.name,
      }),
    },
  });
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<Area>(`/${id}`);
  return data;
};

const update = async (id: number, payload: Payload) => {
  const { data } = await api.patch<Area>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<Area>(`/${id}`);
  return data;
};

export const AreasService = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
