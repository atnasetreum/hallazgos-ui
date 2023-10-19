"use client";

import { useRouter } from "next/navigation";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

import HallazgosTable from "./_components/table/table";

export default function HallazgosPage() {
  const router = useRouter();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <Paper sx={{ p: 2 }}>
          <Button
            variant="contained"
            startIcon={<NoteAddIcon />}
            onClick={() => router.push("/hallazgos/form")}
          >
            Agregar
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Paper sx={{ p: 2 }}>
          <HallazgosTable />
        </Paper>
      </Grid>
    </Grid>
  );
}
