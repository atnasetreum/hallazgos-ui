import { type Dayjs } from "dayjs";

import { ResponseTrainingGuide } from "@interfaces";
import axiosWrapper from "./axiosWrapper";

const api = axiosWrapper({
  baseURL: "/training-guides",
});

const findCurrentData = async (positionId: number, employeeId: number) => {
  const { data } = await api.get<ResponseTrainingGuide>(
    `/position/${positionId}/employee/${employeeId}`
  );
  return data;
};

const saveTrainingGuide = async (payload: {
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
  const { data } = await api.post("/training-guide-employee", payload);
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
  const { data } = await api.post(
    `/training-guide-employee/signature/${id}`,
    payload
  );
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

export const TrainingGuidesService = {
  findCurrentData,
  saveTrainingGuide,
  saveSignature,
  downloadFile,
};
