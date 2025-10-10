import axiosWrapper from "./axiosWrapper";
import { TypeOfLink } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/type-of-links",
});

const findAll = async () => {
  const { data } = await api.get<TypeOfLink[]>("");
  return data;
};

export const TypeOfLinksService = {
  findAll,
};
