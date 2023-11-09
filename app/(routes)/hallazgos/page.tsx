"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

import HallazgosTable from "./_components/table/table";
import { EvidencesService } from "@services";
import { Evidence } from "_interfaces/evicences.interfaces";

export default function HallazgosPage() {
  const [evidences, setEvidences] = useState<Evidence[]>([]);

  const router = useRouter();

  useEffect(() => {
    EvidencesService.findAll().then(setEvidences);
  }, []);

  useEffect(() => {
    console.log(evidences);
  }, [evidences]);

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
          <HallazgosTable rowData={evidences} />
        </Paper>
      </Grid>
    </Grid>
  );
}
