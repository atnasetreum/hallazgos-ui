import axiosWrapper from "./axiosWrapper";

interface PayloadLogin {
  email: string;
  password: string;
}

const api = axiosWrapper({
  baseURL: "/auth",
});

const login = async (payload: PayloadLogin) => {
  const { data } = await api.post<{ message: string }>("/login", payload);
  return data;
};

const logout = async () => {
  const { data } = await api.post<{ message: string }>("/logout");
  return data;
};

export const AuthService = {
  login,
  logout,
};
