"use client";

import { useState } from "react";

import { AuthService } from "@services";

const LoginPage = () => {
  const [email, setEmail] = useState("eduardo-266@hotmail.com");
  const [password, setPassword] = useState("123");

  const login = async () => {
    AuthService.login({
      email,
      password,
    }).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </>
  );
};

export default LoginPage;
