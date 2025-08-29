import axiosWrapper from "./axiosWrapper";
import { Equipment } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/equipments",
});

const findAll = async () => {
  const { data } = await api.get<Equipment[]>("");
  return data;
};

export const EquipmentsService = {
  findAll,
};
