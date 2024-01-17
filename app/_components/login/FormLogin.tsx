"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { AuthService } from "@services";
import { constants } from "@constants";
import { notify, isValidEmail } from "@shared/utils";

const FormLogin = () => {
  const [email, setEmail] = useState(
    process.env.NODE_ENV === constants.environments.development
      ? "eduardo-266@hotmail.com"
      : ""
  );
  const [password, setPassword] = useState(
    process.env.NODE_ENV === constants.environments.development ? "123" : ""
  );

  const router = useRouter();

  const login = async () => {
    const emailClear = email.trim();
    const passwordClear = password.trim();

    if (!emailClear) {
      notify("El correo electrónico es requerido");
      return;
    }

    if (!passwordClear) {
      notify("La contraseña es requerida");
      return;
    }

    if (!isValidEmail(emailClear)) {
      notify("El correo electrónico no es válido");
      return;
    }

    AuthService.login({
      email,
      password,
    }).then(({ message }) => {
      notify(message, true);
      alert();
      router.push("/dashboard");
    });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        fullWidth
        label="Correo Electrónico"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={login}
      >
        Iniciar Sesión
      </Button>
    </Box>
  );
};

export default FormLogin;
