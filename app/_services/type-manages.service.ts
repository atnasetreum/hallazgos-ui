import axiosWrapper from "./axiosWrapper";
import { TypeManage } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/type-manages",
});

const findAll = async () => {
  const { data } = await api.get<TypeManage[]>("");
  return data;
};

export const TypeManagesService = {
  findAll,
};
