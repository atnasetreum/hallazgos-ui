"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Button,
  Fab,
  Grid,
  Paper,
  SelectChangeEvent,
  Zoom,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES } from "@mui/x-date-pickers/locales";
import "dayjs/locale/es";

import SelectManufacturingPlantsOwn from "@components/SelectManufacturingPlantsOwn";
import SelectDefault from "@components/SelectDefault";
import { Area, User } from "@interfaces";
import { AreasService, DashboardService, UsersService } from "@services";
import { useUserSessionStore } from "@store";
import AreasChart from "./charts/AreasChart";
import StatusChart from "./charts/StatusChart";
import AssignedResponsibleChart from "./charts/AssignedResponsibleChart";
import HistoricalChart from "./charts/HistoricalChart";
import SankeyDiagramChart from "./charts/SankeyDiagramChart";
import PackedBubbleChart from "./charts/PackedBubbleChart";
import SolidGaugeMultiKpiChart from "./charts/SolidGaugeMultiKpiChart";
import AreaRangeLineChart from "./charts/AreaRangeLineChart";

interface DashboardFilters {
  manufacturingPlantId: string;
  manufacturingPlantName: string;
  startDate: string;
  endDate: string;
  areaId: string;
  areaName: string;
  responsibleId: string;
  responsibleName: string;
}

const DashboardPage = () => {
  const manufacturingPlants = useUserSessionStore(
    (state) => state.manufacturingPlants || [],
  );

  const currentMonthStart = dayjs().startOf("month").format("DD/MM/YYYY");
  const currentMonthEnd = dayjs().endOf("month").format("DD/MM/YYYY");

  const [filters, setFilters] = useState<DashboardFilters>({
    manufacturingPlantId: "",
    manufacturingPlantName: "",
    startDate: currentMonthStart,
    endDate: currentMonthEnd,
    areaId: "",
    areaName: "",
    responsibleId: "",
    responsibleName: "",
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const [responsibles, setResponsibles] = useState<User[]>([]);
  const [isHistoricalView, setIsHistoricalView] = useState(false);

  const parseDate = (value: string): Dayjs | null => {
    if (!value) return null;

    const [day, month, year] = value.split("/");

    if (!day || !month || !year) return null;

    const parsedDate = dayjs(`${year}-${month}-${day}`);
    return parsedDate.isValid() ? parsedDate : null;
  };

  const handlePlantChange = (event: SelectChangeEvent<string>) => {
    const selectedPlant = manufacturingPlants.find(
      (item) => String(item.id) === event.target.value,
    );

    setFilters((prev) => ({
      ...prev,
      manufacturingPlantId: event.target.value,
      manufacturingPlantName: selectedPlant?.name || "",
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

  const handleScrollTop = () => {
    const scrollableElements = Array.from(
      document.querySelectorAll<HTMLElement>("*"),
    ).filter((element) => {
      const styles = window.getComputedStyle(element);
      const overflowY = styles.overflowY;
      const isScrollable = overflowY === "auto" || overflowY === "scroll";

      return isScrollable && element.scrollHeight > element.clientHeight;
    });

    scrollableElements.forEach((element) => {
      if (element.scrollTop > 0) {
        element.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Grid container spacing={2}>
      {isHistoricalView ? (
        <>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
            }}
          >
            <Button
              variant="contained"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={() => setIsHistoricalView(false)}
            >
              Regresar
            </Button>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
            }}
          >
            <Paper sx={{ minHeight: 500, p: 2 }}>
              <HistoricalChart />
            </Paper>
          </Grid>
        </>
      ) : (
        <>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
            }}
            sx={{
              position: "sticky",
              top: {
                xs: 56,
                sm: 80,
              },
              zIndex: (theme) => theme.zIndex.appBar - 1,
            }}
          >
            <Paper
              sx={{
                p: 1,
                backdropFilter: "blur(8px)",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Grid container spacing={2} alignItems="center">
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
                        esES.components.MuiLocalizationProvider.defaultProps
                          .localeText
                      }
                    >
                      <DatePicker
                        label="Fecha inicio"
                        format="DD/MM/YYYY"
                        value={parseDate(filters.startDate)}
                        maxDate={
                          parseDate(filters.endDate) || dayjs().endOf("month")
                        }
                        onChange={(newValue: Dayjs | null) =>
                          setFilters((prev) => ({
                            ...prev,
                            startDate: newValue
                              ? newValue.format("DD/MM/YYYY")
                              : "",
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
                        esES.components.MuiLocalizationProvider.defaultProps
                          .localeText
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
                            endDate: newValue
                              ? newValue.format("DD/MM/YYYY")
                              : "",
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
                      !filters.manufacturingPlantId
                        ? "Seleccione una planta"
                        : ""
                    }
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 2,
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
                      !filters.manufacturingPlantId
                        ? "Seleccione una planta"
                        : ""
                    }
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<HistoryOutlinedIcon />}
                    sx={{ height: 40 }}
                    onClick={() => setIsHistoricalView(true)}
                  >
                    Histórico
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
            }}
          >
            <Paper sx={{ p: 2 }}>
              <StatusChart filters={filters} />
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
            }}
          >
            <Paper sx={{ p: 2 }}>
              <AreasChart filters={filters} />
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
            }}
          >
            <Paper sx={{ minHeight: 470, p: 2 }}>
              <SolidGaugeMultiKpiChart filters={filters} />
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
            }}
          >
            <Paper sx={{ minHeight: 470, p: 2 }}>
              <AreaRangeLineChart filters={filters} />
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
            }}
          >
            <Paper sx={{ minHeight: 560, p: 2 }}>
              <PackedBubbleChart filters={filters} />
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 6,
            }}
          >
            <Paper sx={{ minHeight: 560, p: 2 }}>
              <SankeyDiagramChart filters={filters} />
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
            }}
          >
            <Paper sx={{ minHeight: 400, p: 2 }}>
              <AssignedResponsibleChart filters={filters} />
            </Paper>
          </Grid>
        </>
      )}

      <Zoom in={true}>
        <Fab
          color="primary"
          size="medium"
          aria-label="Volver arriba"
          onClick={handleScrollTop}
          sx={{
            position: "fixed",
            right: { xs: 16, sm: 24 },
            bottom: { xs: 16, sm: 24 },
            zIndex: (theme) => theme.zIndex.modal + 1,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Grid>
  );
};

export default DashboardPage;
