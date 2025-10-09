import axiosWrapper from "./axiosWrapper";
import { AtMechanism } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/at-mechanisms",
});

const findAll = async () => {
  const { data } = await api.get<AtMechanism[]>("");
  return data;
};

export const AtMechanismsService = {
  findAll,
};
