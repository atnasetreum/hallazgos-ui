import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import {
  MainTypesGlobalTrend,
  MainTypesGlobalTrendDetails,
  MainTypesGlobalTrendDetailsZone,
} from "@interfaces";
import { DashboardService } from "@services";
import { StyledTableCell } from "@shared/components/TableDefault";
import { resolveTriStateSort } from "@shared/utils";

interface Props {
  manufacturingPlantId: string;
}

type Order = "asc" | "desc";
type SortableColumn =
  | "responsable_id"
  | "responsable"
  | "total_asignadas"
  | "abiertas"
  | "cerradas"
  | "canceladas"
  | "pct_resolucion"
  | "promedio_dias_resolucion"
  | "criticos_mas_90_dias"
  | "asignadas_mes_anterior"
  | "asignadas_mes_actual"
  | "max_dias_sin_resolver";

const cardsViewAnimationSx = {
  animation: "cardsViewIn 220ms ease",
  "@keyframes cardsViewIn": {
    from: { opacity: 0, transform: "translateY(8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

const detailsViewAnimationSx = {
  animation: "detailsViewIn 220ms ease",
  "@keyframes detailsViewIn": {
    from: { opacity: 0, transform: "translateY(8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

const parseNumber = (value: string | number | null | undefined) => {
  if (typeof value === "number") return value;
  const parsed = Number(
    String(value ?? "")
      .replace(/,/g, "")
      .trim(),
  );
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatMetric = (value: string | number) => {
  return new Intl.NumberFormat("es-MX").format(parseNumber(value));
};

const formatPercentage = (value: string | number) => {
  const text = String(value ?? "").trim();
  if (!text) return "0%";
  if (text.includes("%")) return text;
  return `${text}%`;
};

const getTrendColor = (
  value: string | number,
): "success" | "error" | "default" => {
  const numeric = parseNumber(value);
  if (numeric > 0) return "success";
  if (numeric < 0) return "error";
  return "default";
};

const getTrendIcon = (value: string | number) => {
  const numeric = parseNumber(value);
  if (numeric > 0) return <TrendingUpIcon fontSize="small" />;
  if (numeric < 0) return <TrendingDownIcon fontSize="small" />;
  return <TrendingFlatIcon fontSize="small" />;
};

const getComplianceLevel = (value: string | number) => {
  const numeric = parseNumber(value);
  if (numeric >= 90) return "Alto";
  if (numeric >= 80) return "Medio";
  return "Bajo";
};

const getComplianceColor = (
  value: string | number,
): "success" | "warning" | "error" => {
  const numeric = parseNumber(value);
  if (numeric >= 90) return "success";
  if (numeric >= 80) return "warning";
  return "error";
};

const MainTypesGlobalTrendAdmin = ({ manufacturingPlantId }: Props) => {
  const [cardsData, setCardsData] = useState<MainTypesGlobalTrend[]>([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [selectedMainType, setSelectedMainType] = useState<string | null>(null);

  const [detailsData, setDetailsData] = useState<MainTypesGlobalTrendDetails[]>(
    [],
  );
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [zoneData, setZoneData] = useState<MainTypesGlobalTrendDetailsZone[]>(
    [],
  );
  const [isZoneLoading, setIsZoneLoading] = useState(false);
  const [detailTab, setDetailTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortableColumn | null>(null);

  useEffect(() => {
    setIsCardsLoading(true);
    setSelectedMainType(null);
    setDetailsData([]);
    setZoneData([]);
    setDetailTab(0);
    setSearchTerm("");
    setOrder("asc");
    setOrderBy(null);
    setPage(0);
    DashboardService.findMainTypesGlobalTrend({
      manufacturingPlantId,
    })
      .then(setCardsData)
      .finally(() => setIsCardsLoading(false));
  }, [manufacturingPlantId]);

  useEffect(() => {
    if (!selectedMainType) return;

    setIsDetailsLoading(true);
    setIsZoneLoading(true);
    DashboardService.findMainTypesGlobalTrendDetails({
      manufacturingPlantId,
      mainTypeId: selectedMainType,
    })
      .then((data) => {
        setDetailsData(data);
        setPage(0);
      })
      .finally(() => setIsDetailsLoading(false));

    DashboardService.findPercentageComplianceByZone({
      manufacturingPlantId,
      mainTypeId: selectedMainType,
    })
      .then((data) => {
        setZoneData(data);
      })
      .finally(() => setIsZoneLoading(false));
  }, [manufacturingPlantId, selectedMainType]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const sortedTrends = useMemo(
    () =>
      [...cardsData].sort(
        (a, b) =>
          parseNumber(b.total_mes_actual) - parseNumber(a.total_mes_actual),
      ),
    [cardsData],
  );

  const totalCurrentMonth = useMemo(
    () =>
      sortedTrends.reduce(
        (acc, item) => acc + parseNumber(item.total_mes_actual),
        0,
      ),
    [sortedTrends],
  );

  const totalPreviousMonth = useMemo(
    () =>
      sortedTrends.reduce(
        (acc, item) => acc + parseNumber(item.total_mes_anterior),
        0,
      ),
    [sortedTrends],
  );

  const weightedResolution = useMemo(() => {
    if (!sortedTrends.length) return 0;
    const totalHistorical = sortedTrends.reduce(
      (acc, item) => acc + parseNumber(item.total_historico),
      0,
    );
    if (!totalHistorical) return 0;
    const weighted = sortedTrends.reduce(
      (acc, item) =>
        acc +
        parseNumber(item.pct_resolucion_historica) *
          parseNumber(item.total_historico),
      0,
    );
    return weighted / totalHistorical;
  }, [sortedTrends]);

  const handleRequestSort = (property: SortableColumn) => {
    const { nextOrder, nextOrderBy } = resolveTriStateSort(
      order,
      orderBy,
      property,
    );

    setOrder(nextOrder);
    setOrderBy(nextOrderBy);
    setPage(0);
  };

  const getSortValue = useCallback(
    (item: MainTypesGlobalTrendDetails, column: SortableColumn) => {
      switch (column) {
        case "responsable":
          return String(item.responsable ?? "").toLowerCase();
        case "max_dias_sin_resolver":
          return item.max_dias_sin_resolver;
        case "responsable_id":
        case "total_asignadas":
        case "abiertas":
        case "cerradas":
        case "canceladas":
        case "pct_resolucion":
        case "promedio_dias_resolucion":
        case "criticos_mas_90_dias":
        case "asignadas_mes_anterior":
        case "asignadas_mes_actual":
        default:
          return parseNumber(item[column]);
      }
    },
    [],
  );

  const filteredDetails = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return detailsData;

    return detailsData.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [detailsData, searchTerm]);

  const sortedDetails = useMemo(() => {
    if (!orderBy) return filteredDetails;

    return [...filteredDetails]
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const valueA = getSortValue(a.item, orderBy);
        const valueB = getSortValue(b.item, orderBy);

        if (valueA < valueB) return order === "asc" ? -1 : 1;
        if (valueA > valueB) return order === "asc" ? 1 : -1;
        return a.index - b.index;
      })
      .map(({ item }) => item);
  }, [filteredDetails, getSortValue, order, orderBy]);

  const paginatedDetails = sortedDetails.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const sortedZoneCards = useMemo(
    () =>
      [...zoneData].sort(
        (a, b) =>
          parseNumber(b.total_hallazgos) - parseNumber(a.total_hallazgos),
      ),
    [zoneData],
  );

  const avgZoneComplianceCurrent = useMemo(() => {
    if (!sortedZoneCards.length) return 0;
    const total = sortedZoneCards.reduce(
      (acc, item) => acc + parseNumber(item.pct_cumplimiento_mes_actual),
      0,
    );
    return total / sortedZoneCards.length;
  }, [sortedZoneCards]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (selectedMainType) {
    return (
      <Paper sx={{ p: 2, ...detailsViewAnimationSx }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Stack spacing={0.5}>
              <Typography variant="h6">
                {
                  cardsData.find((c) => `${c.id}` === selectedMainType)
                    ?.tipo_principal
                }
              </Typography>
            </Stack>

            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedMainType(null);
                setDetailTab(0);
                setSearchTerm("");
                setOrder("asc");
                setOrderBy(null);
                setPage(0);
              }}
            >
              Regresar a tarjetas
            </Button>
          </Stack>

          <Tabs
            value={detailTab}
            onChange={(_, value: number) => setDetailTab(value)}
            variant="fullWidth"
            scrollButtons="auto"
            aria-label="Tabs de detalle"
            indicatorColor="secondary"
            textColor="inherit"
            sx={{
              backgroundColor: "primary.main",
              borderRadius: 1,
              "& .MuiTab-root": {
                color: (theme) => alpha(theme.palette.common.white, 0.68),
                opacity: 1,
                transition: "all 0.2s ease",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "common.white",
                fontWeight: 700,
                backgroundColor: (theme) =>
                  alpha(theme.palette.common.white, 0.14),
              },
            }}
          >
            <Tab label="Cumplimiento por zona" />
            <Tab label="Detalle por responsables" />
          </Tabs>

          <Box role="tabpanel" hidden={detailTab !== 0}>
            {detailTab === 0 && (
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1}
                >
                  <Typography variant="h6">Cumplimiento por zona </Typography>
                  {!!sortedZoneCards.length && (
                    <Chip
                      label={`Promedio cumplimiento mes actual: ${formatPercentage(avgZoneComplianceCurrent.toFixed(1))}`}
                      color={getComplianceColor(avgZoneComplianceCurrent)}
                      size="small"
                    />
                  )}
                </Stack>

                <Grid container spacing={{ xs: 1.5, md: 2 }}>
                  {isZoneLoading
                    ? Array.from({ length: 4 }, (_, index) => (
                        <Grid
                          key={`zone-summary-skeleton-${index}`}
                          size={{ xs: 12, sm: 6, xl: 3 }}
                        >
                          <Paper
                            variant="outlined"
                            sx={{ p: 2, height: "100%" }}
                          >
                            <Stack spacing={1.25}>
                              <Skeleton
                                variant="text"
                                height={30}
                                width="55%"
                              />
                              <Skeleton
                                variant="text"
                                height={38}
                                width="40%"
                              />
                              <Skeleton
                                variant="text"
                                height={20}
                                width="85%"
                              />
                              <Skeleton
                                variant="rounded"
                                width={170}
                                height={28}
                              />
                            </Stack>
                          </Paper>
                        </Grid>
                      ))
                    : sortedZoneCards.map((item) => (
                        <Grid key={item.zona} size={{ xs: 12, sm: 6, xl: 3 }}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              height: "100%",
                              borderColor: "divider",
                              bgcolor: "background.default",
                            }}
                          >
                            <Stack spacing={1.25}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                {item.zona}
                              </Typography>
                              <Typography
                                variant="h4"
                                sx={{ fontSize: { xs: 30, md: 34 } }}
                              >
                                {formatMetric(item.total_hallazgos)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {`Cerradas: ${formatMetric(item.cerradas)} · Abiertas: ${formatMetric(item.abiertas)} · Canceladas: ${formatMetric(item.canceladas)}`}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {`Criticos +90 dias: ${formatMetric(item.criticos_mas_90_dias)} · Promedio dias: ${formatMetric(item.promedio_dias_resolucion)}`}
                              </Typography>
                              <Chip
                                size="small"
                                icon={getTrendIcon(
                                  item.pct_cumplimiento_mes_actual,
                                )}
                                label={`Mes actual: ${formatPercentage(item.pct_cumplimiento_mes_actual)} · Nivel ${getComplianceLevel(item.pct_cumplimiento_mes_actual)}`}
                                color={getComplianceColor(
                                  item.pct_cumplimiento_mes_actual,
                                )}
                                variant="filled"
                                sx={{ alignSelf: "flex-start" }}
                              />
                              <Chip
                                size="small"
                                label={`Historico: ${formatPercentage(item.pct_cumplimiento_historico)} · Mes anterior: ${formatPercentage(item.pct_cumplimiento_mes_anterior)}`}
                                variant="outlined"
                                sx={{ alignSelf: "flex-start" }}
                              />
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}

                  {!isZoneLoading && !sortedZoneCards.length && (
                    <Grid size={{ xs: 12 }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        <Typography variant="body2">
                          No hay informacion de cumplimiento por zona para el
                          tipo seleccionado.
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Stack>
            )}
          </Box>

          <Box role="tabpanel" hidden={detailTab !== 1}>
            {detailTab === 1 && (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  {`${detailsData.length} responsables`}
                </Typography>

                <Box
                  sx={{
                    p: 1,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    variant="filled"
                    label="Buscar en todas las columnas"
                    placeholder="Ej. responsable, abiertas, % resolución, días..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </Box>

                <TableContainer>
                  <Table size="small" aria-label="Detalle por tipo principal">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "responsable_id" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "responsable_id"}
                            direction={
                              orderBy === "responsable_id" ? order : "asc"
                            }
                            onClick={() => handleRequestSort("responsable_id")}
                          >
                            ID
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "responsable" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "responsable"}
                            direction={
                              orderBy === "responsable" ? order : "asc"
                            }
                            onClick={() => handleRequestSort("responsable")}
                          >
                            Responsable
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "total_asignadas" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "total_asignadas"}
                            direction={
                              orderBy === "total_asignadas" ? order : "asc"
                            }
                            onClick={() => handleRequestSort("total_asignadas")}
                          >
                            Total asignadas
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={orderBy === "abiertas" ? order : false}
                        >
                          <TableSortLabel
                            active={orderBy === "abiertas"}
                            direction={orderBy === "abiertas" ? order : "asc"}
                            onClick={() => handleRequestSort("abiertas")}
                          >
                            Abiertas
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={orderBy === "cerradas" ? order : false}
                        >
                          <TableSortLabel
                            active={orderBy === "cerradas"}
                            direction={orderBy === "cerradas" ? order : "asc"}
                            onClick={() => handleRequestSort("cerradas")}
                          >
                            Cerradas
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "canceladas" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "canceladas"}
                            direction={orderBy === "canceladas" ? order : "asc"}
                            onClick={() => handleRequestSort("canceladas")}
                          >
                            Canceladas
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "pct_resolucion" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "pct_resolucion"}
                            direction={
                              orderBy === "pct_resolucion" ? order : "asc"
                            }
                            onClick={() => handleRequestSort("pct_resolucion")}
                          >
                            % Resolucion
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "promedio_dias_resolucion"
                              ? order
                              : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "promedio_dias_resolucion"}
                            direction={
                              orderBy === "promedio_dias_resolucion"
                                ? order
                                : "asc"
                            }
                            onClick={() =>
                              handleRequestSort("promedio_dias_resolucion")
                            }
                          >
                            Promedio dias resolucion
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "criticos_mas_90_dias" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "criticos_mas_90_dias"}
                            direction={
                              orderBy === "criticos_mas_90_dias" ? order : "asc"
                            }
                            onClick={() =>
                              handleRequestSort("criticos_mas_90_dias")
                            }
                          >
                            Criticos +90 dias
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "asignadas_mes_anterior" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "asignadas_mes_anterior"}
                            direction={
                              orderBy === "asignadas_mes_anterior"
                                ? order
                                : "asc"
                            }
                            onClick={() =>
                              handleRequestSort("asignadas_mes_anterior")
                            }
                          >
                            Asignadas mes anterior
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "asignadas_mes_actual" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "asignadas_mes_actual"}
                            direction={
                              orderBy === "asignadas_mes_actual" ? order : "asc"
                            }
                            onClick={() =>
                              handleRequestSort("asignadas_mes_actual")
                            }
                          >
                            Asignadas mes actual
                          </TableSortLabel>
                        </StyledTableCell>
                        <StyledTableCell
                          sortDirection={
                            orderBy === "max_dias_sin_resolver" ? order : false
                          }
                        >
                          <TableSortLabel
                            active={orderBy === "max_dias_sin_resolver"}
                            direction={
                              orderBy === "max_dias_sin_resolver"
                                ? order
                                : "asc"
                            }
                            onClick={() =>
                              handleRequestSort("max_dias_sin_resolver")
                            }
                          >
                            Max dias sin resolver
                          </TableSortLabel>
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {isDetailsLoading && (
                        <TableRow>
                          <StyledTableCell colSpan={12}>
                            Cargando detalle del tipo principal...
                          </StyledTableCell>
                        </TableRow>
                      )}

                      {!isDetailsLoading && !filteredDetails.length && (
                        <TableRow>
                          <StyledTableCell colSpan={12}>
                            <Typography variant="body2" color="text.secondary">
                              {detailsData.length
                                ? "No se encontraron resultados con la busqueda actual."
                                : "No hay detalle para el tipo principal seleccionado."}
                            </Typography>
                          </StyledTableCell>
                        </TableRow>
                      )}

                      {!isDetailsLoading &&
                        paginatedDetails.map((item, index) => (
                          <TableRow key={`${item.responsable_id}-${index}`}>
                            <StyledTableCell>
                              {item.responsable_id}
                            </StyledTableCell>
                            <StyledTableCell sx={{ maxWidth: 220 }}>
                              <Tooltip title={item.responsable || ""} arrow>
                                <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.responsable}
                                </Typography>
                              </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.total_asignadas}
                            </StyledTableCell>
                            <StyledTableCell>{item.abiertas}</StyledTableCell>
                            <StyledTableCell>{item.cerradas}</StyledTableCell>
                            <StyledTableCell>{item.canceladas}</StyledTableCell>
                            <StyledTableCell>
                              {item.pct_resolucion}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.promedio_dias_resolucion}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.criticos_mas_90_dias}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.asignadas_mes_anterior}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.asignadas_mes_actual}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.max_dias_sin_resolver}
                            </StyledTableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {!isDetailsLoading && !!filteredDetails.length && (
                  <TablePagination
                    component="div"
                    count={filteredDetails.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Filas por pagina"
                    showFirstButton
                    showLastButton
                  />
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, ...cardsViewAnimationSx }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Typography variant="h6">
            Tendencia global por tipo principal
          </Typography>
          {sortedTrends.length > 0 && (
            <Chip
              label={`Resolucion ponderada historica: ${formatPercentage(weightedResolution.toFixed(1))}`}
              color="primary"
              variant="filled"
              size="small"
            />
          )}
        </Stack>

        {sortedTrends.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {`Mes actual: ${formatMetric(totalCurrentMonth)} · Mes anterior: ${formatMetric(totalPreviousMonth)}`}
          </Typography>
        )}

        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          {isCardsLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <Grid
                  key={`main-type-trend-skeleton-${index}`}
                  size={{ xs: 12, sm: 6, xl: 3 }}
                >
                  <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                    <Stack spacing={1.25}>
                      <Skeleton variant="text" height={30} width="65%" />
                      <Skeleton variant="text" height={40} width="45%" />
                      <Skeleton variant="rounded" height={10} width="100%" />
                      <Skeleton variant="text" height={20} width="80%" />
                      <Skeleton variant="rounded" width={180} height={28} />
                    </Stack>
                  </Paper>
                </Grid>
              ))
            : sortedTrends.map((item) => {
                const current = parseNumber(item.total_mes_actual);
                const progress = totalCurrentMonth
                  ? (current / totalCurrentMonth) * 100
                  : 0;

                return (
                  <Grid
                    key={item.tipo_principal}
                    size={{ xs: 12, sm: 6, xl: 3 }}
                  >
                    <Paper
                      onClick={() => setSelectedMainType(`${item.id}`)}
                      variant="outlined"
                      sx={{
                        p: 2,
                        height: "100%",
                        borderColor: "divider",
                        bgcolor: "background.default",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Stack spacing={1.25}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {item.tipo_principal}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontSize: { xs: 30, md: 34 } }}
                        >
                          {formatMetric(item.total_mes_actual)}
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          color="primary"
                          sx={{ height: 8, borderRadius: 999 }}
                        />

                        <Typography variant="caption" color="text.secondary">
                          {`Historico: ${formatMetric(item.total_historico)} · Abiertas: ${formatMetric(item.abiertas)} · Cerradas: ${formatMetric(item.cerradas)}`}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {`Mes anterior: ${formatMetric(item.total_mes_anterior)} · Abiertas mes: ${formatMetric(item.abiertas_mes_actual)} · Cerradas mes: ${formatMetric(item.cerradas_mes_actual)}`}
                        </Typography>

                        <Chip
                          size="small"
                          icon={getTrendIcon(item.pct_cambio_total)}
                          label={`${formatPercentage(item.pct_cambio_total)} vs mes anterior`}
                          color={getTrendColor(item.pct_cambio_total)}
                          variant="filled"
                          sx={{ alignSelf: "flex-start" }}
                        />
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}

          {!isCardsLoading && sortedTrends.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper
                variant="outlined"
                sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
              >
                <Typography variant="body2">
                  No hay datos de tendencia por tipo principal para esta planta.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Stack>
    </Paper>
  );
};

export default MainTypesGlobalTrendAdmin;
