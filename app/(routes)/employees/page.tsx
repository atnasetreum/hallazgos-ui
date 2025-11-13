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
import { EmployeesService } from "@services";
import { Employee } from "@interfaces";
import FiltersUsers, {
  type IFiltersEmployees,
} from "./_components/FiltersEmployees";
import { useTheme } from "@mui/material/styles";
import TableEmployees from "./_components/TableEmployees.";

const EmployeesPage = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<IFiltersEmployees>({
    name: "",
  });

  const router = useRouter();
  const theme = useTheme();

  const getData = useDebouncedCallback(() => {
    setIsLoading(true);
    EmployeesService.findAll(filters)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, 500);

  useEffect(() => {
    getData();
  }, [getData, filters]);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <Typography
          variant="h4"
          gutterBottom
          color={
            theme.palette.mode === "light"
              ? theme.palette.common.black
              : theme.palette.common.white
          }
        >
          Colaboradores
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push("/employees/form")}
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
        <FiltersUsers
          filters={filters}
          setFilters={setFilters}
          count={data.length}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {isLoading ? (
          <LoadingLinear />
        ) : (
          <TableEmployees rows={data} getData={getData} />
        )}
      </Grid>
    </Grid>
  );
};

export default EmployeesPage;
