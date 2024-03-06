import Image from "next/image";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import FormLogin from "@components/login/FormLogin";
import Copyright from "@shared/components/Copyright";

export default function SignIn() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_URL_API_RAW}/static/images/login/logo-superior.png`}
          alt=""
          width="300"
          height="200"
        />
        <FormLogin />
      </Box>
      <Image
        src={`${process.env.NEXT_PUBLIC_URL_API_RAW}/static/images/login/logo-inferior.png`}
        alt=""
        width="400"
        height="100"
      />
      <Copyright sx={{ mb: 4 }} />
    </Container>
  );
}
