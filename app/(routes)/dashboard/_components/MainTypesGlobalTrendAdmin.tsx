import { useEffect, useMemo, useState } from "react";

import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { MainTypesGlobalTrend } from "@interfaces";
import { DashboardService } from "@services";

interface Props {
  manufacturingPlantId: string;
}

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

const MainTypesGlobalTrendAdmin = ({ manufacturingPlantId }: Props) => {
  const [mainTypesTrend, setMainTypesTrend] = useState<MainTypesGlobalTrend[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    DashboardService.findMainTypesGlobalTrend({
      manufacturingPlantId,
    })
      .then(setMainTypesTrend)
      .finally(() => setIsLoading(false));
  }, [manufacturingPlantId]);

  const sortedTrends = useMemo(
    () =>
      [...mainTypesTrend].sort(
        (a, b) =>
          parseNumber(b.total_mes_actual) - parseNumber(a.total_mes_actual),
      ),
    [mainTypesTrend],
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

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 } }}>
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
          {isLoading
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
                      variant="outlined"
                      sx={{
                        p: 2,
                        height: "100%",
                        borderColor: "divider",
                        bgcolor: "background.default",
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

          {!isLoading && sortedTrends.length === 0 && (
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
