import axiosWrapper from "./axiosWrapper";
import { User } from "@interfaces";

interface Payload {
  name: string;
  email: string;
  password: string;
  rule: string;
  manufacturingPlantNames: string[];
  zoneNames: string[];
}

const api = axiosWrapper({
  baseURL: "/users",
});

const create = async (payload: Payload) => {
  const { data } = await api.post<User>("", payload);
  return data;
};

const findAll = async (filters: {
  name?: string;
  manufacturingPlantId?: string;
  rule?: string;
  zoneId?: string;
}) => {
  const { data } = await api.get<User[]>("", {
    params: {
      ...(filters?.name && {
        name: filters.name,
      }),
      ...(filters?.manufacturingPlantId && {
        manufacturingPlantId: filters.manufacturingPlantId,
      }),
      ...(filters?.rule && {
        rule: filters.rule,
      }),
      ...(filters?.zoneId && {
        zoneId: filters.zoneId,
      }),
    },
  });
  return data;
};

const getInformationCurrentUser = async () => {
  const { data } = await api.get<User>("/get-information-current-user");
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<User>(`/${id}`);
  return data;
};

const update = async (id: number, payload: Payload) => {
  const { data } = await api.patch<User>(`/${id}`, payload);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<User>(`/${id}`);
  return data;
};

const findAllSupervisors = async () => {
  const { data } = await api.get<User[]>("/supervisors");
  return data;
};

export const UsersService = {
  create,
  findAll,
  getInformationCurrentUser,
  findOne,
  update,
  remove,
  findAllSupervisors,
};
