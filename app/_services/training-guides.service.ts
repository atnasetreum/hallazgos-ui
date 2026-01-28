import { type Dayjs } from "dayjs";

import { ResponseTrainingGuide, Topic } from "@interfaces";
import axiosWrapper from "./axiosWrapper";

const api = axiosWrapper({
  baseURL: "/training-guides",
});

const findCurrentData = async ({
  positionId,
  employeeId,
  manufacturingPlantId,
}: {
  positionId: number;
  employeeId: number;
  manufacturingPlantId: number;
}) => {
  const { data } = await api.get<ResponseTrainingGuide>(
    `/position/${positionId}/employee/${employeeId}/manufacturingPlant/${manufacturingPlantId}`,
  );
  return data;
};

const create = async (payload: {
  manufacturingPlantId: number;
  startDate: Dayjs;
  evaluations: {
    date: Dayjs | null;
    evaluation: string;
    observations: string;
    topicId: number;
  }[];
  positionId: number;
  employeeId: number;
  areaTgeId: number;
  humanResourceTgeId: number;
}) => {
  const { data } = await api.post("", payload);
  return data;
};

const saveSignature = async ({
  id,
  ...payload
}: {
  signature: string;
  userId: number;
  type: string;
  id: number;
}) => {
  const { data } = await api.post(`/signature/${id}`, payload);
  return data;
};

const downloadFile = async (id: number) => {
  const { data } = await api.get(`/download/file/${id}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "guiaEntrenamiento.xlsx");
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);

  return "ok";
};

const findAllTopics = async () => {
  const { data } = await api.get<Topic[]>("/topics");
  return data;
};

const update = async (
  id: number,
  payload: {
    manufacturingPlantId: number;
    startDate: Dayjs;
    evaluations: {
      date: Dayjs | null;
      evaluation: string;
      observations: string;
      topicId: number;
    }[];
    positionId: number;
    employeeId: number;
    areaTgeId: number;
    humanResourceTgeId: number;
  },
) => {
  const { data } = await api.patch(`/${id}`, payload);
  return data;
};

export const TrainingGuidesService = {
  findCurrentData,
  create,
  update,
  saveSignature,
  downloadFile,
  findAllTopics,
};
