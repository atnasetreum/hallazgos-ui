import axiosWrapper from "./axiosWrapper";
import { Ciael } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/ciaels",
});

interface Payload {
  managerId?: string | undefined;
  accidentPositionId: string;
  zoneId: string;
  bodyPartId: string;
  atAgentId: string;
  typeOfInjuryId: string;
  atMechanismId: string;
  workingDayId: string;
  timeWorked: string;
  usualWork: boolean;
  typeOfLinkId: string;
  isDeath: boolean;
  machineId: string;
  isInside: boolean;
  associatedTaskId: string;
  areaLeaderId: string;
  riskFactorId: string;
  natureOfEventsId: string;
  daysOfDisability?: string | undefined;
  manufacturingPlantId: string;
  typeOfEventId: string;
  description: string;
  employeeId: string;
  eventDate: string;
  cieDiagnosisId: string;
}

const findAll = async () => {
  const { data } = await api.get<Ciael[]>("");
  return data;
};

const create = async (payload: Payload) => {
  const { data } = await api.post<Ciael>("", payload);
  return data;
};

const downloadExcel = async () => {
  const { data } = await api.get(`/download/excel`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "CIAEL.xlsx");
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);

  return "ok";
};

export const CiaelsService = {
  findAll,
  create,
  downloadExcel,
};
