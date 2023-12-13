"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import RefreshIcon from "@mui/icons-material/Refresh";

import HallazgosTable from "./_components/HallazgosTable";
import { EvidencesService } from "@services";
import { Evidence } from "_interfaces/evicences.interfaces";
import LoadingLinear from "@shared/components/LoadingLinear";

export default function HallazgosPage() {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const getData = async () => {
    setIsLoading(true);

    EvidencesService.findAll()
      .then(setEvidences)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="contained"
              startIcon={<NoteAddIcon />}
              onClick={() => router.push("/hallazgos/form")}
            >
              Agregar
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => getData()}
          >
            Actualizar
          </Button>
        </Toolbar>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {isLoading ? (
          <LoadingLinear />
        ) : (
          <HallazgosTable rows={evidences} getData={getData} />
        )}
      </Grid>
    </Grid>
  );
}
