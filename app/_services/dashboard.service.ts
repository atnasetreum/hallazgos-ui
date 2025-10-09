import axiosWrapper from "./axiosWrapper";
import {
  ResponseAccidents,
  ResponseDashboardEvidencesByMonth,
  ResponseDashboardMainTypes,
  ResponseDashboardMultiNivel,
  ResponseOpenVsClosed,
  ResponseTopUsersByPlant,
} from "@interfaces";

const api = axiosWrapper({
  baseURL: "/dashboard",
});

const findAllStatus = async () => {
  const { data } = await api.get<ResponseDashboardMultiNivel>("/status");
  return data;
};

const findOpendVsClosed = async () => {
  const { data } = await api.get<ResponseOpenVsClosed>("/open-vs-closed");
  return data;
};

const findAccidentRate = async (year?: number) => {
  const { data } = await api.get<ResponseAccidents[]>("/accidents-by-month", {
    params: {
      ...(year && { year }),
    },
  });
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

const findAllEvidencesByMonth = async (year?: number) => {
  const { data } = await api.get<ResponseDashboardEvidencesByMonth>(
    "/evidences-by-month",
    {
      params: {
        ...(year && { year }),
      },
    }
  );
  return data;
};

const findTopUsersByPlant = async () => {
  const { data } = await api.get<ResponseTopUsersByPlant>(
    "/top-users-by-plant"
  );
  return data.data;
};

export const DashboardService = {
  findAccidentRate,
  findTopUsersByPlant,
  findAllEvidencesByMonth,
  findAllStatus,
  findAllZones,
  findAllMainTypes,
  findOpendVsClosed,
};
