import axiosWrapper from "./axiosWrapper";
import { TypeOfInjury } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/type-of-injuries",
});

const findAll = async () => {
  const { data } = await api.get<TypeOfInjury[]>("");
  return data;
};

export const TypeOfInjuriesService = {
  findAll,
};
