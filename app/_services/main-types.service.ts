import axiosWrapper from "./axiosWrapper";
import { MainType } from "@interfaces";

interface Payload {
  name: string;
}

const api = axiosWrapper({
  baseURL: "/main-types",
});

const create = async (payload: Payload) => {
  const { data } = await api.post<MainType>("", payload);
  return data;
};

const findAll = async (filters: { name?: string }) => {
  const { data } = await api.get<MainType[]>("", {
    params: {
      ...(filters?.name && {
        name: filters.name,
      }),
    },
  });
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<MainType>(`/${id}`);
  return data;
};

const update = async (id: number, payload: Payload) => {
  const { data } = await api.patch<MainType>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<MainType>(`/${id}`);
  return data;
};

export const MainTypesService = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
