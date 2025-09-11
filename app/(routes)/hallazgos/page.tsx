"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ButtonGroup from "@mui/material/ButtonGroup";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { toast } from "sonner";
import LoadingButton from "@mui/lab/LoadingButton";

import TableEvidences from "./_components/TableEvidences";
import LoadingLinear from "@shared/components/LoadingLinear";
import FiltersEvidence, {
  FiltersEvidences,
} from "./_components/FiltersEvidence";
import { useEvidences } from "@hooks";
import { EvidencesService } from "@services";

export default function HallazgosPage() {
  const [filters, setFilters] = useState<FiltersEvidences>({
    manufacturingPlantId: "",
    mainTypeId: "",
    secondaryType: "",
    zone: "",
    process: "",
    state: "",
  });

  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState<boolean>(false);

  const {
    findEvidences,
    evidences,
    isLoading,
    countEvidence,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  } = useEvidences();

  const router = useRouter();

  const getData = useCallback(() => {
    findEvidences(filters);
  }, [filters, page, rowsPerPage]);

  const createPdf = () => {
    if (!filters.manufacturingPlantId) {
      toast.error("Seleccione una planta");
      return;
    }

    if (countEvidence > 500) {
      toast.error("El número máximo de registros para exportar en PDF es 500");
      return;
    }

    setIsLoadingPdf(true);

    EvidencesService.downloadPdf(filters).finally(() => setIsLoadingPdf(false));
  };

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

          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => getData()}
            />
            <LoadingButton
              variant="contained"
              startIcon={<SimCardDownloadIcon />}
              onClick={() => {
                setIsLoadingExcel(true);
                EvidencesService.downloadExcel(filters).finally(() =>
                  setIsLoadingExcel(false)
                );
              }}
              loading={isLoadingExcel}
            >
              EXCEL
            </LoadingButton>
            <LoadingButton
              variant="contained"
              startIcon={<SimCardDownloadIcon />}
              onClick={() => createPdf()}
              loading={isLoadingPdf}
            >
              PDF
            </LoadingButton>
          </ButtonGroup>
        </Toolbar>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <FiltersEvidence
          filters={filters}
          setFilters={setFilters}
          count={countEvidence}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {isLoading ? (
          <LoadingLinear />
        ) : (
          <TableEvidences
            rows={evidences}
            getData={getData}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            countEvidence={countEvidence}
          />
        )}
      </Grid>
    </Grid>
  );
}
