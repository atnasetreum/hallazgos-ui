import axiosWrapper from "./axiosWrapper";
import { AccidentPosition } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/accident-positions",
});

const findAll = async (filters: { manufacturingPlantId?: string }) => {
  const { data } = await api.get<AccidentPosition[]>("", {
    params: {
      ...(filters?.manufacturingPlantId && {
        manufacturingPlantId: filters.manufacturingPlantId,
      }),
    },
  });
  return data;
};

export const AccidentPositionsService = {
  findAll,
};
