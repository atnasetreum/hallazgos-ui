import axiosWrapper from "./axiosWrapper";

const api = axiosWrapper({
  baseURL: "/evidences",
});

const findAll = async () => {
  const { data } = await api.get("");
  return data;
};

export const HallazgosService = {
  findAll,
};
