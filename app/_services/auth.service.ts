import axiosWrapper from "./axiosWrapper";

const api = axiosWrapper({
  baseURL: "/auth",
});

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post<string>(
    "/login",
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return data;
};

export const AuthService = {
  login,
};
