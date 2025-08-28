import axiosWrapper from "./axiosWrapper";

interface Payload {
  employeeId: number;
  signature: string;
  equipments: {
    id: number;
    quantity: number;
    observations: string;
  }[];
}

const api = axiosWrapper({
  baseURL: "/epps",
});

const create = async (payload: Payload) => {
  const { data } = await api.post("", payload, {
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
};
