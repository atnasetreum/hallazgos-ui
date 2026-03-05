import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TextField } from "@mui/material";
import { Paper } from "@mui/material";

import SelectManufacturingPlants from "@components/SelectManufacturingPlants";

export interface IFiltersZones {
  name: string;
  manufacturingPlantId: string;
}

interface Props {
  filters: IFiltersZones;
  setFilters: (filters: IFiltersZones) => void;
  count: number;
}

const FiltersZones = ({ filters, setFilters, count }: Props) => {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid
        size={{
          xs: 12,
          sm: 12,
          md: 12,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          <FilterListIcon sx={{ pt: 1 }} /> Filtros ({count})
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
    </Grid>
  );
};

export default FiltersZones;
