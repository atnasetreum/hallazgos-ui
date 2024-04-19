"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import Add from "@mui/icons-material/Add";
import ButtonGroup from "@mui/material/ButtonGroup";

import LoadingLinear from "@shared/components/LoadingLinear";
import { ManufacturingPlantsService } from "@services";
import { ManufacturingPlant } from "@interfaces";
import TableManufacturingPlants from "./_components/TableManufacturingPlants";
import FiltersManufacturingPlants, {
  IFiltersManufacturingPlants,
} from "./_components/FiltersManufacturingPlants";

const ManufacturingPlantsPage = () => {
  const [data, setData] = useState<ManufacturingPlant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<IFiltersManufacturingPlants>({
    name: "",
  });

  const router = useRouter();

  const getData = useCallback(() => {
    setIsLoading(true);
    ManufacturingPlantsService.findAll(filters)
      .then(setData)
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
              startIcon={<Add />}
              onClick={() => router.push("/manufacturing-plants/form")}
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
          </ButtonGroup>
        </Toolbar>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <FiltersManufacturingPlants
          filters={filters}
          setFilters={setFilters}
          count={data.length}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {isLoading ? (
          <LoadingLinear />
        ) : (
          <TableManufacturingPlants rows={data} getData={getData} />
        )}
      </Grid>
    </Grid>
  );
};

export default ManufacturingPlantsPage;
