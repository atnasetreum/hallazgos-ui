import {
  ResponseDashboardMainTypes,
  ResponseDashboardMultiNivel,
} from "@interfaces";
import axiosWrapper from "./axiosWrapper";

const api = axiosWrapper({
  baseURL: "/dashboard",
});

const findAllStatus = async () => {
  const { data } = await api.get<ResponseDashboardMultiNivel>("/status");
  return data;
};

const findAllZones = async () => {
  const { data } = await api.get<ResponseDashboardMultiNivel>("/zones");
  return data;
};

const findAllMainTypes = async () => {
  const { data } = await api.get<ResponseDashboardMainTypes>("/main-types");
  return data;
};

export const DashboardService = {
  findAllStatus,
  findAllZones,
  findAllMainTypes,
};
