import { IFiltersEmployees } from "@routes/employees/_components/FiltersEmployees";
import axiosWrapper from "./axiosWrapper";
import { CatalogEmployee, Employee } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/employees",
});

interface Payload {
  code: string;
  name: string;
}

const findAll = async ({ manufacturingPlantId, name }: IFiltersEmployees) => {
  const { data } = await api.get<Employee[]>("", {
    params: {
      ...(manufacturingPlantId && { manufacturingPlantId }),
      ...(name && { name }),
    },
  });
  return data;
};

const create = async (payload: Payload) => {
  const { data } = await api.post<Employee>("", payload);
  return data;
};

const update = async (id: number, payload: Payload) => {
  const { data } = await api.patch<Employee>(`/${id}`, payload);
  return data;
};

const findOne = async (id: number) => {
  const { data } = await api.get<Employee>(`/${id}`);
  return data;
};

const catalogs = async () => {
  const { data } = await api.get<CatalogEmployee>(`/catalogs`);
  return data;
};

const remove = async (id: number) => {
  const { data } = await api.delete<Employee>(`/${id}`);
  return data;
};

export const EmployeesService = {
  findAll,
  create,
  update,
  findOne,
  catalogs,
  remove,
};
