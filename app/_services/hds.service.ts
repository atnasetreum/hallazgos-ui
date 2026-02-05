import { IFiltersHds } from "@routes/hds/page";
import axiosWrapper from "./axiosWrapper";
import { Hds } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/safety-data-files",
});

const findAll = async ({ name }: IFiltersHds) => {
  const { data } = await api.get<Hds[]>("", {
    params: {
      ...(name && { name }),
    },
  });
  return data;
};

const downloadFile = async (name: string) => {
  const { data } = await api.get<Blob>(`download?name=${name}`, {
    responseType: "blob",
  });
  const file = new Blob([data], { type: "application/pdf" });
  const fileURL = URL.createObjectURL(file);

  // Abrir en nueva pestaña
  window.open(fileURL, "_blank");
};

export const HdsService = {
  findAll,
  downloadFile,
};
