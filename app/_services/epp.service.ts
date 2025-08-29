import { Epp, PayloadCreateEpp } from "@interfaces";
import axiosWrapper from "./axiosWrapper";

const api = axiosWrapper({
  baseURL: "/epps",
});

const create = async (payload: PayloadCreateEpp) => {
  const { data } = await api.post("", payload);
  return data;
};

const findAll = async () => {
  const { data } = await api.get<Epp[]>("");
  return data;
};

const downloadFile = async (employeeId: number) => {
  const { data } = await api.get(`/download/file/${employeeId}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "formatoEPP.xlsx");
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);

  return "ok";
};

export const EppService = {
  create,
  findAll,
  downloadFile,
};
