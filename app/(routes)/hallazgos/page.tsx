"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

import TableEvidences from "./_components/TableEvidences";
import { EvidencesService } from "@services";
import { Evidence } from "_interfaces/evicences.interfaces";
import LoadingLinear from "@shared/components/LoadingLinear";
import FiltersEvidence, {
  FiltersEvidences,
} from "./_components/FiltersEvidence";

export default function HallazgosPage() {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FiltersEvidences>({
    manufacturingPlantId: "",
    mainTypeId: "",
    secondaryType: "",
    zone: "",
  });

  const router = useRouter();

  const getData = useCallback(() => {
    setIsLoading(true);
    EvidencesService.findAll(filters)
      .then(setEvidences)
      .finally(() => setIsLoading(false));
  }, [filters]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddAPhotoIcon />}
              onClick={() => router.push("/hallazgos/form")}
            >
              Crear
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
        <FiltersEvidence
          filters={filters}
          setFilters={setFilters}
          count={evidences.length}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {isLoading ? (
          <LoadingLinear />
        ) : (
          <TableEvidences rows={evidences} getData={getData} />
        )}
      </Grid>
    </Grid>
  );
}
