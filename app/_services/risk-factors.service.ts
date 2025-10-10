import axiosWrapper from "./axiosWrapper";
import { RiskFactor } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/risk-factors",
});

const findAll = async () => {
  const { data } = await api.get<RiskFactor[]>("");
  return data;
};

export const RiskFactorsService = {
  findAll,
};
