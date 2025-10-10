import axiosWrapper from "./axiosWrapper";
import { NatureOfEvent } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/nature-of-events",
});

const findAll = async () => {
  const { data } = await api.get<NatureOfEvent[]>("");
  return data;
};

export const NatureOfEventsService = {
  findAll,
};
