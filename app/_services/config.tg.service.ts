import { IFiltersConfigTg } from "@routes/config-tg/page";
import axiosWrapper from "./axiosWrapper";
import { ConfigTg } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/configs-tg",
});

interface Payload {
  manufacturingPlantId: number;
  positionId: number;
  areaManagerId: number;
  humanResourceManagerId: number;
  topics: {
    id: number;
    responsibleIds: number[];
  }[];
}

const create = async (payload: Partial<Payload>) => {
  const { data } = await api.post<ConfigTg>(``, payload);
  return data;
};

const findAll = async ({
  manufacturingPlantId,
  positionId,
}: IFiltersConfigTg) => {
  const { data } = await api.get<ConfigTg[]>(``, {
    params: {
      ...(manufacturingPlantId && { manufacturingPlantId }),
      ...(positionId && { positionId }),
    },
  });
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<ConfigTg>(`/${id}`);
  return data;
};

const update = async (id: number, payload: Partial<Payload>) => {
  const { data } = await api.patch<ConfigTg>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<ConfigTg>(`/${id}`);
  return data;
};

export const ConfigTgService = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
