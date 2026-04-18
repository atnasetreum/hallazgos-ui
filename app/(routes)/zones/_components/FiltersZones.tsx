import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TextField } from "@mui/material";
import { Paper } from "@mui/material";

import SelectDefault from "@components/SelectDefault";
import SelectManufacturingPlants from "@components/SelectManufacturingPlants";
import { AreasService } from "@services";
import { Area } from "@interfaces";

export interface IFiltersZones {
  name: string;
  manufacturingPlantId: string;
  areaId: string;
}

interface Props {
  filters: IFiltersZones;
  setFilters: (filters: IFiltersZones) => void;
  count: number;
}

const FiltersZones = ({ filters, setFilters, count }: Props) => {
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    AreasService.findAll({}).then((data) => {
      const orderedAreas = [...data].sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" }),
      );

      setAreas(orderedAreas);
    });
  }, []);

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid
        size={{
          xs: 12,
          sm: 12,
          md: 12,
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            color: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.common.black
                : theme.palette.common.white,
          }}
        >
          <FilterListIcon
            sx={{
              pt: 1,
            }}
          />
          Filtros ({count})
        </Typography>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
      >
        <Paper>
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            value={filters.name}
            autoComplete="off"
            onChange={(e) =>
              setFilters({
                ...filters,
                name: e.target.value,
              })
            }
          />
        </Paper>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
      >
        <Paper>
          <SelectManufacturingPlants
            value={filters.manufacturingPlantId}
            onChange={(e) =>
              setFilters({
                ...filters,
                manufacturingPlantId: e.target.value,
              })
            }
            isFilter={true}
          />
        </Paper>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
      >
        <SelectDefault
          data={areas}
          label="Zona"
          value={filters.areaId}
          onChange={(e) =>
            setFilters({
              ...filters,
              areaId: e.target.value,
            })
          }
          isFilter={true}
        />
      </Grid>
    </Grid>
  );
};

export default FiltersZones;
