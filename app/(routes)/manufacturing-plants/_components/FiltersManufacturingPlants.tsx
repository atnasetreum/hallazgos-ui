import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FilterListIcon from "@mui/icons-material/FilterList";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";

export interface IFiltersManufacturingPlants {
  name: string;
}

interface Props {
  filters: IFiltersManufacturingPlants;
  setFilters: (filters: IFiltersManufacturingPlants) => void;
  count: number;
}

const FiltersManufacturingPlants = ({ filters, setFilters, count }: Props) => {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant="subtitle1" gutterBottom>
          <FilterListIcon sx={{ pt: 1 }} /> Filters ({count})
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper>
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            value={filters.name}
            autoComplete="off"
            onChange={(e) => {
              setFilters({
                ...filters,
                name: e.target.value,
              });
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FiltersManufacturingPlants;
