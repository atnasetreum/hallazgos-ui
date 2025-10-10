import axiosWrapper from "./axiosWrapper";
import { Employee } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/employees",
});

interface FiltersEmployees {
  manufacturingPlantId?: number;
}

const findAll = async ({ manufacturingPlantId }: FiltersEmployees) => {
  const { data } = await api.get<Employee[]>("", {
    params: {
      ...(manufacturingPlantId && { manufacturingPlantId }),
    },
  });
  return data;
};

export const EmployeesService = {
  findAll,
};
