import axiosWrapper from "./axiosWrapper";
import { TypeOfEvent } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/types-of-events",
});

const findAll = async () => {
  const { data } = await api.get<TypeOfEvent[]>("");
  return data;
};

export const TypesOfEventsService = {
  findAll,
};
