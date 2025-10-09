import axiosWrapper from "./axiosWrapper";
import { AtAgent } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/at-agents",
});

const findAll = async () => {
  const { data } = await api.get<AtAgent[]>("");
  return data;
};

export const AtAgentsService = {
  findAll,
};
