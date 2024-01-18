import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
        <Avatar
          alt="Remy Sharp"
          src="https://media.glassdoor.com/sql/2795097/cosm%C3%A9ticos-trujillo-squarelogo-1672380267723.png"
          sx={{ height: "100px", width: "100px" }}
        />
        <Typography component="h1" variant="h5">
          Grupo Hada
        </Typography>
        <FormLogin />
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
