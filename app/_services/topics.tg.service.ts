import { IFiltersTopics } from "@routes/topics-tg/page";
import axiosWrapper from "./axiosWrapper";
import { Topic } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/topics",
});

const create = async (payload: Partial<Topic>) => {
  const { data } = await api.post<Topic>(``, payload);
  return data;
};

const findAll = async ({ manufacturingPlantId, name }: IFiltersTopics) => {
  const { data } = await api.get<Topic[]>(``, {
    params: {
      ...(manufacturingPlantId && { manufacturingPlantId }),
      ...(name && { name }),
    },
  });
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<Topic>(`/${id}`);
  return data;
};

const update = async (id: number, payload: Partial<Topic>) => {
  const { data } = await api.patch<Topic>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<Topic>(`/${id}`);
  return data;
};

export const TopicsService = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
