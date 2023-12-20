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
import { utils, WorkBook, writeFileXLSX } from "xlsx";

import TableEvidences from "./_components/TableEvidences";
import { EvidencesService } from "@services";
import { Evidence } from "_interfaces/evicences.interfaces";
import LoadingLinear from "@shared/components/LoadingLinear";
import FiltersEvidence, {
  FiltersEvidences,
} from "./_components/FiltersEvidence";
import { durantionToTime, stringToDateWithTime } from "@shared/utils";

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

  const createExcel = () => {
    if (evidences) {
      const data = evidences.map((evidence) => ({
        ["ID"]: evidence.id,
        ["Palnta"]: evidence.manufacturingPlant.name,
        ["Grupo"]: evidence.mainType.name,
        ["Tipo de hallazgo"]: evidence.secondaryType.name,
        ["Zona"]: evidence.zone.name,
        ["Creado por"]: evidence.user.name,
        ["Supervisor"]: evidence.supervisor.name,
        ["Estatus"]: evidence.status,
        ["Fecha de creación"]: stringToDateWithTime(evidence.createdAt),
        ["Fecha de actualización"]: stringToDateWithTime(evidence.updatedAt),
        ["Fecha de cierre"]: evidence.solutionDate
          ? stringToDateWithTime(evidence.solutionDate)
          : "",
        ["Tiempo de solución"]: evidence.solutionDate
          ? durantionToTime(evidence.createdAt, evidence.solutionDate)
          : "",
      }));
      const wb: WorkBook = utils.book_new();
      const ws = utils.json_to_sheet(data);
      utils.book_append_sheet(wb, ws, "SheetJS");
      writeFileXLSX(wb, "hallazgos.xlsx");
    }
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
            ></Button>
            <Button
              variant="contained"
              startIcon={<SimCardDownloadIcon />}
              onClick={() => createExcel()}
            >
              EXCEL
            </Button>
          </ButtonGroup>
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
