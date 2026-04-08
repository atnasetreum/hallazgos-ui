import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";

import FilterListIcon from "@mui/icons-material/FilterList";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Paper } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES } from "@mui/x-date-pickers/locales";
import "dayjs/locale/es";

import { useCategoriesStore, useUserSessionStore } from "@store";
import SelectDefault from "@components/SelectDefault";
import { SecondaryType } from "@interfaces";

export interface FiltersEvidences {
  manufacturingPlantId: string;
  mainTypeId: string;
  secondaryType: string;
  zone: string;
  process: string;
  state: string;
  startDate: string;
  endDate: string;
}

interface Props {
  filters: FiltersEvidences;
  setFilters: (filters: FiltersEvidences) => void;
  count: number;
}

const FiltersEvidence = ({ filters, setFilters, count }: Props) => {
  const [secondaryTypes, setSecondaryTypes] = useState<SecondaryType[]>([]);

  const parseDate = (value: string): Dayjs | null => {
    if (!value) return null;

    const [day, month, year] = value.split("/");

    if (!day || !month || !year) return null;

    const parsedDate = dayjs(`${year}-${month}-${day}`);
    return parsedDate.isValid() ? parsedDate : null;
  };

  const manufacturingPlants = useUserSessionStore(
    (state) => state.manufacturingPlants,
  );

  const { mainTypes, zones, processes } = useCategoriesStore();

  useEffect(() => {
    if (filters.mainTypeId) {
      setSecondaryTypes(
        mainTypes.find((data) => data.id === Number(filters.mainTypeId))
          ?.secondaryTypes || [],
      );
    }
  }, [filters.mainTypeId, mainTypes]);

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid
        size={{
          xs: 12,
          sm: 12,
          md: 12,
        }}
      >
        <Typography variant="subtitle1" gutterBottom color="primary.main">
          <FilterListIcon sx={{ pt: 1 }} /> Filtros ({count})
        </Typography>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 3,
          md: 2,
        }}
      >
        <SelectDefault
          data={manufacturingPlants}
          label="Planta"
          isFilter={true}
          value={filters.manufacturingPlantId}
          onChange={(e) => {
            setFilters({
              ...filters,
              manufacturingPlantId: e.target.value,
            });
          }}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 3,
          md: 2,
        }}
      >
        <SelectDefault
          data={mainTypes}
          label="Hallazgo"
          isFilter={true}
          value={filters.mainTypeId}
          onChange={(e) => {
            setFilters({
              ...filters,
              secondaryType: "",
              mainTypeId: e.target.value,
            });
          }}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 3,
          md: 2,
        }}
      >
        <SelectDefault
          data={secondaryTypes}
          label="Tipo"
          isFilter={true}
          value={filters.secondaryType}
          onChange={(e) =>
            setFilters({
              ...filters,
              secondaryType: e.target.value,
            })
          }
          helperText={!filters.mainTypeId ? "Seleccione un hallazgo" : ""}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 3,
          md: 2,
        }}
      >
        <SelectDefault
          data={zones.filter(
            (data) =>
              data.manufacturingPlant.id ===
              Number(filters.manufacturingPlantId),
          )}
          label="Zona"
          isFilter={true}
          value={filters.zone}
          onChange={(e) =>
            setFilters({
              ...filters,
              zone: e.target.value,
            })
          }
          helperText={
            !filters.manufacturingPlantId ? "Seleccione una planta" : ""
          }
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 3,
          md: 2,
        }}
      >
        <SelectDefault
          data={processes}
          label="Administrador"
          isFilter={true}
          value={filters.process}
          onChange={(e) =>
            setFilters({
              ...filters,
              process: e.target.value,
            })
          }
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 3,
          md: 2,
        }}
      >
        <SelectDefault
          data={[
            { id: "Abierto", name: "Abierto" },
            { id: "Cerrado", name: "Cerrado" },
            { id: "Cancelado", name: "Cancelado" },
          ]}
          label="Estatus"
          isFilter={true}
          value={filters.state}
          onChange={(e) =>
            setFilters({
              ...filters,
              state: e.target.value,
            })
          }
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 3,
          md: 2,
        }}
      >
        <Paper>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es"
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DatePicker
              label="Fecha inicio"
              format="DD/MM/YYYY"
              value={parseDate(filters.startDate)}
              maxDate={parseDate(filters.endDate) || dayjs()}
              onChange={(newValue: Dayjs | null) =>
                setFilters({
                  ...filters,
                  startDate: newValue ? newValue.format("DD/MM/YYYY") : "",
                })
              }
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () =>
                    setFilters({
                      ...filters,
                      startDate: "",
                    }),
                },
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Paper>
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 3,
          md: 2,
        }}
      >
        <Paper>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es"
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DatePicker
              label="Fecha fin"
              format="DD/MM/YYYY"
              value={parseDate(filters.endDate)}
              minDate={parseDate(filters.startDate) || undefined}
              maxDate={dayjs()}
              onChange={(newValue: Dayjs | null) =>
                setFilters({
                  ...filters,
                  endDate: newValue ? newValue.format("DD/MM/YYYY") : "",
                })
              }
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () =>
                    setFilters({
                      ...filters,
                      endDate: "",
                    }),
                },
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FiltersEvidence;
