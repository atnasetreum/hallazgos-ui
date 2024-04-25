"use client";

import { useRouter } from "next/navigation";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

const ManufacturingPlantsFormPage = () => {
  const router = useRouter();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6}>
        <Paper>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            autoComplete="off"
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<CloseIcon />}
          onClick={() => router.push("/manufacturing-plants")}
        >
          Cancelar
        </Button>
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <LoadingButton
          loading={false}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
          fullWidth
        >
          Guardar
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default ManufacturingPlantsFormPage;
