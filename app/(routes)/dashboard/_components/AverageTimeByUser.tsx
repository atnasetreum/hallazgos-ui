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

import { DashboardService } from "@services";
import { AverageResolutionByUser, User } from "@interfaces";

interface Props {
  manufacturingPlantId: string;
  user: User;
}

const AverageTimeByUser = ({ manufacturingPlantId, user }: Props) => {
  const [averageTime, setAverageTime] =
    useState<AverageResolutionByUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    const numeric = parseNumber(value);
    return new Intl.NumberFormat("es-MX").format(numeric);
  };

  const formatDays = (value: string | number) => {
    const numeric = parseNumber(value);
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: numeric % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    }).format(numeric);
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

  useEffect(() => {
    setIsLoading(true);
    DashboardService.findAverageResolutionTimeByUser({
      manufacturingPlantId,
      userId: user.id,
    })
      .then(setAverageTime)
      .finally(() => setIsLoading(false));
  }, [manufacturingPlantId, user.id]);

  const cards = averageTime
    ? [
        {
          title: "Histórico",
          average: averageTime.promedio_dias_historico,
          monthly: `${formatCount(averageTime.total_cerradas_historico)} cerradas`,
          previous: `Rango ${formatDays(averageTime.minimo_dias)} - ${formatDays(averageTime.maximo_dias)} días`,
          trend: averageTime.pct_cambio_promedio,
          icon: <HistoryIcon />,
        },
        {
          title: "Mes actual",
          average: averageTime.promedio_dias_mes_actual,
          monthly: `${formatCount(averageTime.total_cerradas_mes_actual)} cerradas`,
          previous: `${formatDays(averageTime.promedio_dias_mes_anterior)} días mes anterior`,
          trend: averageTime.pct_cambio_promedio,
          icon: <CalendarMonthIcon />,
        },
        {
          title: "Mes anterior",
          average: averageTime.promedio_dias_mes_anterior,
          monthly: `${formatCount(averageTime.total_cerradas_mes_anterior)} cerradas`,
          previous: `${formatDays(averageTime.promedio_dias_mes_actual)} días mes actual`,
          trend: averageTime.pct_cambio_promedio,
          icon: <TimerIcon />,
        },
      ]
    : [];

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Typography variant="h6">
          Tiempo promedio de resolución · {user.name}
        </Typography>

        <Grid container spacing={2.5}>
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <Grid
                  key={`average-time-skeleton-${index}`}
                  size={{ xs: 12, md: 4 }}
                >
                  <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                    <Stack spacing={1.25}>
                      <Skeleton variant="rounded" width={40} height={40} />
                      <Skeleton variant="text" width="50%" height={44} />
                      <Skeleton variant="text" width="70%" height={22} />
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="rounded" width={170} height={28} />
                    </Stack>
                  </Paper>
                </Grid>
              ))
            : cards.map((card) => (
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
                        {card.monthly} · {card.previous}
                      </Typography>

                      <Chip
                        size="small"
                        icon={getTrendIcon(card.trend)}
                        label={`${formatPercentage(card.trend)} vs mes anterior`}
                        color={getResolutionTrendColor(card.trend)}
                        variant="filled"
                        sx={{ alignSelf: "flex-start" }}
                      />
                    </Stack>
                  </Paper>
                </Grid>
              ))}
        </Grid>
      </Stack>
    </Paper>
  );
};

export default AverageTimeByUser;
