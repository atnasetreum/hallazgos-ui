import { useEffect, useState } from "react";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TimerIcon from "@mui/icons-material/Timer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { AverageResolution } from "@interfaces";
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

const formatCount = (value: string | number) => {
  const number = parseNumber(value);
  return new Intl.NumberFormat("es-MX").format(number);
};

const formatDays = (value: string | number) => {
  const number = parseNumber(value);
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: number % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(number);
};

const formatPercentage = (value: string | number) => {
  const text = String(value ?? "").trim();
  if (!text) return "0%";
  if (text.includes("%")) return text;
  return `${text}%`;
};

const getTrendIcon = (value: string | number) => {
  const numeric = parseNumber(value);
  if (numeric > 0) return <TrendingUpIcon fontSize="small" />;
  if (numeric < 0) return <TrendingDownIcon fontSize="small" />;
  return <TrendingFlatIcon fontSize="small" />;
};

const getResolutionTrendColor = (
  value: string | number,
): "success" | "error" | "default" => {
  const numeric = parseNumber(value);
  if (numeric < 0) return "success";
  if (numeric > 0) return "error";
  return "default";
};

const AverageResolutionAdmin = ({ manufacturingPlantId }: Props) => {
  const [averageResolutionTime, setAverageResolutionTime] =
    useState<AverageResolution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasNoData, setHasNoData] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setHasNoData(false);

    DashboardService.findAverageResolutionTime({
      manufacturingPlantId,
    })
      .then((response) => {
        const hasValidData =
          !!response &&
          [
            response.promedio_dias_historico,
            response.total_cerradas_historico,
            response.promedio_dias_mes_actual,
            response.total_cerradas_mes_actual,
            response.promedio_dias_mes_anterior,
            response.total_cerradas_mes_anterior,
          ].some((value) => parseNumber(value) > 0);

        if (hasValidData) {
          setAverageResolutionTime(response);
          return;
        }

        setAverageResolutionTime(null);
        setHasNoData(true);
      })
      .catch(() => {
        setAverageResolutionTime(null);
        setHasNoData(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [manufacturingPlantId]);

  const cards = averageResolutionTime
    ? [
        {
          title: "Histórico",
          average: averageResolutionTime.promedio_dias_historico,
          closed: averageResolutionTime.total_cerradas_historico,
          icon: <HistoryIcon />,
        },
        {
          title: "Mes actual",
          average: averageResolutionTime.promedio_dias_mes_actual,
          closed: averageResolutionTime.total_cerradas_mes_actual,
          icon: <CalendarMonthIcon />,
        },
        {
          title: "Mes anterior",
          average: averageResolutionTime.promedio_dias_mes_anterior,
          closed: averageResolutionTime.total_cerradas_mes_anterior,
          icon: <TimerIcon />,
        },
      ]
    : [];

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
            Tiempo promedio de resolución{" "}
            {averageResolutionTime?.planta
              ? `· ${averageResolutionTime.planta}`
              : ""}
          </Typography>
          {averageResolutionTime && (
            <Chip
              size="small"
              icon={getTrendIcon(averageResolutionTime.pct_cambio_promedio)}
              label={`${formatPercentage(averageResolutionTime.pct_cambio_promedio)} vs mes anterior`}
              color={getResolutionTrendColor(
                averageResolutionTime.pct_cambio_promedio,
              )}
              variant="filled"
            />
          )}
        </Stack>

        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          {isLoading ? (
            Array.from({ length: 3 }, (_, index) => (
              <Grid
                key={`average-resolution-skeleton-${index}`}
                size={{ xs: 12, md: 4 }}
              >
                <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                  <Stack spacing={1.25}>
                    <Skeleton variant="rounded" width={40} height={40} />
                    <Skeleton variant="text" height={44} width="60%" />
                    <Skeleton variant="text" height={22} width="50%" />
                    <Skeleton variant="text" height={20} width="35%" />
                  </Stack>
                </Paper>
              </Grid>
            ))
          ) : hasNoData ? (
            <Grid size={{ xs: 12 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderColor: "divider",
                  bgcolor: "background.default",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No hay datos de tiempo promedio de resolución para la planta
                  seleccionada.
                </Typography>
              </Paper>
            </Grid>
          ) : averageResolutionTime ? (
            cards.map((card) => (
              <Grid key={card.title} size={{ xs: 12, md: 4 }}>
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
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "action.selected",
                        color: "primary.main",
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: 30, md: 34 } }}
                    >
                      {formatDays(card.average)} días
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCount(card.closed)} cerradas
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))
          ) : null}
        </Grid>
      </Stack>
    </Paper>
  );
};

export default AverageResolutionAdmin;
