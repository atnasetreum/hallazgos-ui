import axiosWrapper from "./axiosWrapper";

import { User } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/users",
});

const findAll = async () => {
  const { data } = await api.get<User[]>("");
  return data;
};

const getInformationCurrentUser = async () => {
  const { data } = await api.get<User>("/get-information-current-user");
  return data;
};

export const UsersService = {
  findAll,
  getInformationCurrentUser,
};
