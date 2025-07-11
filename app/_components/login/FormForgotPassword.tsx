"use client";

import { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { AuthService } from "@services";
import { constants } from "@constants";
import { notify, isValidEmail } from "@shared/utils";

interface Props {
  setForgotPassword: (value: boolean) => void;
}

const FormForgotPassword = ({ setForgotPassword }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState(
    process.env.NODE_ENV === constants.environments.development
      ? "eduardo-266@hotmail.com"
      : ""
  );

  const login = async () => {
    const emailClear = email.trim();

    if (!emailClear) {
      notify("El correo electrónico es requerido");
      return;
    }

    if (!isValidEmail(emailClear)) {
      notify("El correo electrónico no es válido");
      return;
    }

    setIsLoading(true);

    AuthService.forgotPassword(email)
      .then(({ message }) => {
        notify(message, true);
        setForgotPassword(false);
      })
      .finally(() => setIsLoading(false));
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
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={login}
        disabled={isLoading}
      >
        Enviar correo de recuperación
      </Button>
    </Box>
  );
};

export default FormForgotPassword;
