import { Link } from "@mui/material";
import { Typography } from "@mui/material";

export default function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://cosmeticostrujillo.com"
        target="_blank"
      >
        Cosmeticos trujillo
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
