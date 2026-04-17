import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TextField } from "@mui/material";
import { Paper } from "@mui/material";
import SelectManufacturingPlantsOwn from "@components/SelectManufacturingPlantsOwn";

export interface IFiltersAreas {
  name: string;
  manufacturingPlantId: string;
}

interface Props {
  filters: IFiltersAreas;
  setFilters: (filters: IFiltersAreas) => void;
  count: number;
}

const FiltersAreas = ({ filters, setFilters, count }: Props) => {
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
          <FilterListIcon
            sx={{
              pt: 1,
              color: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.common.black
                  : theme.palette.common.white,
            }}
          />{" "}
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
      <SelectManufacturingPlantsOwn
        value={filters.manufacturingPlantId}
        onChange={(e) =>
          setFilters({
            ...filters,
            manufacturingPlantId: e.target.value,
          })
        }
        isFilter={true}
      />
    </Grid>
  );
};

export default FiltersAreas;
