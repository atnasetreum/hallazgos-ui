import axiosWrapper from "./axiosWrapper";
import { WorkingDay } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/working-days",
});

const findAll = async () => {
  const { data } = await api.get<WorkingDay[]>("");
  return data;
};

export const WorkingDaysService = {
  findAll,
};
