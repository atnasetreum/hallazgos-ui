import axiosWrapper from "./axiosWrapper";
import { Equipment } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/equipments",
});

const findAll = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<Equipment[]>("", {
    params: {
      manufacturingPlantId,
    },
  });
  return data;
};

export const EquipmentsService = {
  findAll,
};
