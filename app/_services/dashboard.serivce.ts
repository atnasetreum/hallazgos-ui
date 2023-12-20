import axiosWrapper from "./axiosWrapper";
import { DashboardStatus } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/dashboard",
});

const findAllStatus = async () => {
  const { data } = await api.get<DashboardStatus>("/status");
  return data;
};

const findRelevantData = async () => {
  const { data } = await api.get("/relevant-data");
  return data;
};

export const DashboardService = {
  findAllStatus,
  findRelevantData,
};
