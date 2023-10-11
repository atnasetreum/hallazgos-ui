import axiosWrapper from "./axiosWrapper";

import { User } from "@interfaces";

const api = axiosWrapper({
  baseURL: "/users",
});

const findAll = async () => {
  const { data } = await api.get<User[]>("");
  return data;
};

export const UsersService = {
  findAll,
};
