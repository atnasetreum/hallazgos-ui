import axiosWrapper from "./axiosWrapper";
import { Employee } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/employees",
});

const findAll = async () => {
  const { data } = await api.get<Employee[]>("");
  return data;
};

export const EmployeesService = {
  findAll,
};
