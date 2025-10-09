import axiosWrapper from "./axiosWrapper";
import { BodyPart } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/body-parts",
});

const findAll = async () => {
  const { data } = await api.get<BodyPart[]>("");
  return data;
};

export const BodyPartsService = {
  findAll,
};
