"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { Grid, Paper, SelectChangeEvent, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES } from "@mui/x-date-pickers/locales";
import "dayjs/locale/es";

import SelectManufacturingPlantsOwn from "@components/SelectManufacturingPlantsOwn";
import SelectDefault from "@components/SelectDefault";
import { Area, User } from "@interfaces";
import { AreasService, DashboardService, UsersService } from "@services";
import StatusChart from "./charts/StatusChart";

interface DashboardFilters {
  manufacturingPlantId: string;
  startDate: string;
  endDate: string;
  areaId: string;
  areaName: string;
  responsibleId: string;
  responsibleName: string;
}

const DashboardPage = () => {
  const currentMonthStart = dayjs().startOf("month").format("DD/MM/YYYY");
  const currentMonthEnd = dayjs().endOf("month").format("DD/MM/YYYY");

  const [filters, setFilters] = useState<DashboardFilters>({
    manufacturingPlantId: "",
    startDate: currentMonthStart,
    endDate: currentMonthEnd,
    areaId: "",
    areaName: "",
    responsibleId: "",
    responsibleName: "",
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const [responsibles, setResponsibles] = useState<User[]>([]);

  const parseDate = (value: string): Dayjs | null => {
    if (!value) return null;

    const [day, month, year] = value.split("/");

    if (!day || !month || !year) return null;

    const parsedDate = dayjs(`${year}-${month}-${day}`);
    return parsedDate.isValid() ? parsedDate : null;
  };

  const handlePlantChange = (event: SelectChangeEvent<string>) => {
    setFilters((prev) => ({
      ...prev,
      manufacturingPlantId: event.target.value,
      areaId: "",
      areaName: "",
      responsibleId: "",
      responsibleName: "",
    }));
  };

  useEffect(() => {
    if (!filters.manufacturingPlantId) {
      setAreas([]);
      return;
    }

    AreasService.findAll({
      manufacturingPlantId: filters.manufacturingPlantId,
    }).then(setAreas);

    setFilters((prev) => ({
      ...prev,
      areaId: "",
      areaName: "",
      responsibleId: "",
      responsibleName: "",
    }));
  }, [filters.manufacturingPlantId]);

  useEffect(() => {
    if (!filters.manufacturingPlantId) {
      setResponsibles([]);
      return;
    }

    const shouldLoadByArea =
      !!filters.areaId && !!filters.startDate && !!filters.endDate;

    if (shouldLoadByArea) {
      DashboardService.findResponsiblesByFilters({
        manufacturingPlantId: filters.manufacturingPlantId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        areaId: filters.areaId,
      }).then(setResponsibles);
      return;
    }

    UsersService.findAll({
      manufacturingPlantId: filters.manufacturingPlantId,
    }).then(setResponsibles);
  }, [
    filters.manufacturingPlantId,
    filters.areaId,
    filters.responsibleId,
    filters.startDate,
    filters.endDate,
  ]);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h5" fontWeight={700}>
          Dashboard
        </Typography>
      </Grid>

      <SelectManufacturingPlantsOwn
        value={filters.manufacturingPlantId}
        onChange={handlePlantChange}
        isFilter={true}
      />

      <Grid
        size={{
          xs: 12,
          sm: 6,
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
              maxDate={parseDate(filters.endDate) || dayjs().endOf("month")}
              onChange={(newValue: Dayjs | null) =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: newValue ? newValue.format("DD/MM/YYYY") : "",
                }))
              }
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () =>
                    setFilters((prev) => ({
                      ...prev,
                      startDate: "",
                    })),
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
          sm: 6,
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
              maxDate={dayjs().endOf("month")}
              onChange={(newValue: Dayjs | null) =>
                setFilters((prev) => ({
                  ...prev,
                  endDate: newValue ? newValue.format("DD/MM/YYYY") : "",
                }))
              }
              slotProps={{
                field: {
                  clearable: true,
                  onClear: () =>
                    setFilters((prev) => ({
                      ...prev,
                      endDate: "",
                    })),
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
          sm: 6,
          md: 2,
        }}
      >
        <SelectDefault
          data={areas}
          label="Zonas"
          isFilter={true}
          value={filters.areaId}
          onChange={(_, newValue) =>
            setFilters((prev) => ({
              ...prev,
              areaId: newValue ? String(newValue.id) : "",
              areaName: newValue?.name || "",
              responsibleId: "",
              responsibleName: "",
            }))
          }
          helperText={
            !filters.manufacturingPlantId ? "Seleccione una planta" : ""
          }
        />
      </Grid>

      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
      >
        <SelectDefault
          data={responsibles}
          label="Responsable"
          isFilter={true}
          value={filters.responsibleId}
          onChange={(_, newValue) =>
            setFilters((prev) => ({
              ...prev,
              responsibleId: newValue ? String(newValue.id) : "",
              responsibleName: newValue?.name || "",
            }))
          }
          helperText={
            !filters.manufacturingPlantId ? "Seleccione una planta" : ""
          }
        />
      </Grid>

      <Grid size={12}>
        <Paper sx={{ p: 2, minHeight: 420 }}>
          <StatusChart filters={filters} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
