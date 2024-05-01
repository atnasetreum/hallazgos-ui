"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import Add from "@mui/icons-material/Add";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useDebouncedCallback } from "use-debounce";
import Typography from "@mui/material/Typography";

import LoadingLinear from "@shared/components/LoadingLinear";
import { SecondaryTypesService } from "@services";
import { SecondaryType } from "@interfaces";
import TableSecondaryTypes from "./_components/TableSecondaryTypes";
import FiltersSecondaryTypes, {
  IFiltersSecondaryTypes,
} from "./_components/FiltersSecondaryTypes";

const SecondaryTypesPage = () => {
  const [data, setData] = useState<SecondaryType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<IFiltersSecondaryTypes>({
    name: "",
    mainTypeId: "",
  });

  const router = useRouter();

  const getData = useDebouncedCallback(() => {
    setIsLoading(true);
    SecondaryTypesService.findAll(filters)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, 500);

  useEffect(() => {
    getData();
  }, [getData, filters]);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant="h4" gutterBottom>
          Tipos de criterios
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/secondary-types/form")}
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
        <FiltersSecondaryTypes
          filters={filters}
          setFilters={setFilters}
          count={data.length}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {isLoading ? (
          <LoadingLinear />
        ) : (
          <TableSecondaryTypes rows={data} getData={getData} />
        )}
      </Grid>
    </Grid>
  );
};

export default SecondaryTypesPage;
