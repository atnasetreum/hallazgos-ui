import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";

import FilterListIcon from "@mui/icons-material/FilterList";
import { Box } from "@mui/material";
import { Chip } from "@mui/material";
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
  mainTypeIds: string[];
  secondaryTypeIds: string[];
  zoneIds: string[];
  processIds: string[];
  states: string[];
  startDate: string;
  endDate: string;
}

interface Props {
  filters: FiltersEvidences;
  setFilters: (filters: FiltersEvidences) => void;
  count: number;
}

const STATUS_OPTIONS = [
  { id: "Abierto", name: "Abierto" },
  { id: "En progreso", name: "En progreso" },
  { id: "Cerrado", name: "Cerrado" },
  { id: "Cancelado", name: "Cancelado" },
];

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
    if (!filters.mainTypeIds.length) {
      setSecondaryTypes([]);
      return;
    }

    const selectedMainTypeIds = new Set(filters.mainTypeIds.map(Number));
    const mergedSecondaryTypes = mainTypes
      .filter((data) => selectedMainTypeIds.has(Number(data.id)))
      .flatMap((data) => data.secondaryTypes || []);

    const uniqueSecondaryTypes = Array.from(
      new Map(
        mergedSecondaryTypes.map((secondaryType) => [
          String(secondaryType.id),
          secondaryType,
        ]),
      ).values(),
    );

    setSecondaryTypes(uniqueSecondaryTypes);
  }, [filters.mainTypeIds, mainTypes]);

  useEffect(() => {
    if (!filters.secondaryTypeIds.length) {
      return;
    }

    const allowedSecondaryTypeIds = new Set(
      secondaryTypes.map((secondaryType) => String(secondaryType.id)),
    );
    const scopedSecondaryTypeIds = filters.secondaryTypeIds.filter((id) =>
      allowedSecondaryTypeIds.has(id),
    );

    if (scopedSecondaryTypeIds.length !== filters.secondaryTypeIds.length) {
      setFilters({
        ...filters,
        secondaryTypeIds: scopedSecondaryTypeIds,
      });
    }
  }, [filters, secondaryTypes, setFilters]);

  const selectedFilterChips = useMemo(() => {
    const getNamesByIds = (
      ids: string[],
      options: Array<{ id: number | string; name: string }>,
    ) => {
      const idSet = new Set(ids);
      return options
        .filter((option) => idSet.has(String(option.id)))
        .map((option) => option.name);
    };

    const formatValues = (values: string[]) => {
      if (values.length <= 2) return values.join(", ");
      return `${values.slice(0, 2).join(", ")} +${values.length - 2}`;
    };

    const chips: Array<{ key: string; label: string }> = [];

    if (filters.manufacturingPlantId) {
      const plant = manufacturingPlants.find(
        (item) => String(item.id) === filters.manufacturingPlantId,
      );

      if (plant) {
        chips.push({ key: "plant", label: `Planta: ${plant.name}` });
      }
    }

    const mainTypeNames = getNamesByIds(filters.mainTypeIds, mainTypes);
    if (mainTypeNames.length) {
      chips.push({
        key: "mainTypes",
        label: `Clasificación: ${formatValues(mainTypeNames)}`,
      });
    }

    const secondaryTypeNames = getNamesByIds(
      filters.secondaryTypeIds,
      secondaryTypes,
    );
    if (secondaryTypeNames.length) {
      chips.push({
        key: "secondaryTypes",
        label: `Tipo: ${formatValues(secondaryTypeNames)}`,
      });
    }

    const zoneNames = getNamesByIds(filters.zoneIds, zones);
    if (zoneNames.length) {
      chips.push({ key: "zones", label: `Lugar: ${formatValues(zoneNames)}` });
    }

    const processNames = getNamesByIds(filters.processIds, processes);
    if (processNames.length) {
      chips.push({
        key: "processes",
        label: `Administrador: ${formatValues(processNames)}`,
      });
    }

    const stateNames = getNamesByIds(filters.states, STATUS_OPTIONS);
    if (stateNames.length) {
      chips.push({
        key: "states",
        label: `Estatus: ${formatValues(stateNames)}`,
      });
    }

    if (filters.startDate) {
      chips.push({ key: "startDate", label: `Desde: ${filters.startDate}` });
    }

    if (filters.endDate) {
      chips.push({ key: "endDate", label: `Hasta: ${filters.endDate}` });
    }

    return chips;
  }, [
    filters,
    mainTypes,
    manufacturingPlants,
    processes,
    secondaryTypes,
    zones,
  ]);

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
          sx={(theme) => ({
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          })}
        >
          <FilterListIcon sx={{ pt: 1 }} /> Filtros ({count})
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {selectedFilterChips.length > 0 ? (
            selectedFilterChips.map((chip) => (
              <Chip
                key={chip.key}
                label={chip.label}
                size="small"
                variant="filled"
                color="primary"
              />
            ))
          ) : (
            <Chip
              label="Sin filtros seleccionados"
              size="small"
              variant="filled"
            />
          )}
        </Box>
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
              zoneIds: [],
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
          label="Clasificación"
          multiple={true}
          isFilter={true}
          value={filters.mainTypeIds}
          onChange={(_, newValue) => {
            setFilters({
              ...filters,
              secondaryTypeIds: [],
              mainTypeIds: Array.isArray(newValue)
                ? newValue.map((item) => String(item.id))
                : [],
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
          multiple={true}
          isFilter={true}
          value={filters.secondaryTypeIds}
          onChange={(_, newValue) =>
            setFilters({
              ...filters,
              secondaryTypeIds: Array.isArray(newValue)
                ? newValue.map((item) => String(item.id))
                : [],
            })
          }
          helperText={
            !filters.mainTypeIds.length ? "Seleccione una clasificación" : ""
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
          data={zones.filter(
            (data) =>
              data.manufacturingPlant.id ===
              Number(filters.manufacturingPlantId),
          )}
          label="Lugar"
          multiple={true}
          isFilter={true}
          value={filters.zoneIds}
          onChange={(_, newValue) =>
            setFilters({
              ...filters,
              zoneIds: Array.isArray(newValue)
                ? newValue.map((item) => String(item.id))
                : [],
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
          multiple={true}
          isFilter={true}
          value={filters.processIds}
          onChange={(_, newValue) =>
            setFilters({
              ...filters,
              processIds: Array.isArray(newValue)
                ? newValue.map((item) => String(item.id))
                : [],
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
          data={STATUS_OPTIONS}
          label="Estatus"
          multiple={true}
          isFilter={true}
          value={filters.states}
          onChange={(_, newValue) =>
            setFilters({
              ...filters,
              states: Array.isArray(newValue)
                ? newValue.map((item) => String(item.id))
                : [],
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
