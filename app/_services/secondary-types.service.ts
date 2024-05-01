import axiosWrapper from "./axiosWrapper";
import { SecondaryType } from "@interfaces";

interface Payload {
  name: string;
  mainTypeId: number;
}

const api = axiosWrapper({
  baseURL: "/secondary-types",
});

const create = async (payload: Payload) => {
  const { data } = await api.post<SecondaryType>("", payload);
  return data;
};

const findAll = async (filters: { name?: string; mainTypeId?: string }) => {
  const { data } = await api.get<SecondaryType[]>("", {
    params: {
      ...(filters?.name && {
        name: filters.name,
      }),
      ...(filters?.mainTypeId && {
        mainTypeId: filters.mainTypeId,
      }),
    },
  });
  return data;
};

const findAllByManufacturingPlant = async (id: number) => {
  const { data } = await api.get<SecondaryType[]>(
    `/by/manufacturing-plant/${id}`
  );
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<SecondaryType>(`/${id}`);
  return data;
};

const update = async (id: number, payload: Payload) => {
  const { data } = await api.patch<SecondaryType>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<SecondaryType>(`/${id}`);
  return data;
};

export const SecondaryTypesService = {
  create,
  findAll,
  findAllByManufacturingPlant,
  findOne,
  update,
  remove,
};
