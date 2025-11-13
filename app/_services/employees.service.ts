import { IFiltersEmployees } from "@routes/employees/_components/FiltersEmployees";
import axiosWrapper from "./axiosWrapper";
import { Employee } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/employees",
});

const findAll = async ({ manufacturingPlantId, name }: IFiltersEmployees) => {
  const { data } = await api.get<Employee[]>("", {
    params: {
      ...(manufacturingPlantId && { manufacturingPlantId }),
      ...(name && { name }),
    },
  });
  return data;
};

export const EmployeesService = {
  findAll,
};
