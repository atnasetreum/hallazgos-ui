import axiosWrapper from "./axiosWrapper";
import { Zone } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/zones",
});

const findAll = async () => {
  const { data } = await api.get<Zone[]>("");
  return data;
};

export const ZonesService = {
  findAll,
};
