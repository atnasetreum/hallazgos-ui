import axiosWrapper from "./axiosWrapper";
import {
  EvaluationValues,
  ExtinguisherInspection,
  ExtinguisherType,
} from "@interfaces";

interface EvaluationPayload {
  location: string;
  extinguisherNumber: number;
  typeOfExtinguisher: ExtinguisherType;
  capacity: number;
  pressureManometer: EvaluationValues;
  valve: EvaluationValues;
  hose: EvaluationValues;
  cylinder: EvaluationValues;
  barrette: EvaluationValues;
  seal: EvaluationValues;
  cornet: EvaluationValues;
  access: EvaluationValues;
  support: EvaluationValues;
  signaling: EvaluationValues;
  nextRechargeDate: string;
  maintenanceDate: string;
  observations?: string;
}

interface Payload {
  inspectionDate: string;
  manufacturingPlantId: number;
  evaluations: EvaluationPayload[];
}

interface Filters {
  search?: string;
  manufacturingPlantId?: string;
  inspectionDate?: string;
}

const api = axiosWrapper({
  baseURL: "/extinguisher-inspections",
});

const create = async (payload: Payload) => {
  const { data } = await api.post<ExtinguisherInspection>("", payload);
  return data;
};

const findAll = async (filters: Filters) => {
  const { data } = await api.get<ExtinguisherInspection[]>("", {
    params: {
      ...(filters?.search && { search: filters.search }),
      ...(filters?.manufacturingPlantId && {
        manufacturingPlantId: filters.manufacturingPlantId,
      }),
      ...(filters?.inspectionDate && {
        inspectionDate: filters.inspectionDate,
      }),
    },
  });

  return data;
};

export const ExtinguisherInspectionsService = {
  create,
  findAll,
};
