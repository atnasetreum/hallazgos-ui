import { useEffect, useState } from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PlaylistAddCheckCircleOutlinedIcon from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CancelScheduleSendOutlinedIcon from "@mui/icons-material/CancelScheduleSendOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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
import { AverageResolutionByUserAssigned, User } from "@interfaces";

interface Props {
  manufacturingPlantId: string;
  user: User;
}

const AverageTimeByUserAssigned = ({ manufacturingPlantId, user }: Props) => {
  const [assignedSummary, setAssignedSummary] =
    useState<AverageResolutionByUserAssigned | null>(null);
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

  const formatMetric = (value: string | number) => {
    const number = parseNumber(value);
    return new Intl.NumberFormat("es-MX").format(number);
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

  const getTrendColor = (
    value: string | number,
  ): "success" | "error" | "default" => {
    const numeric = parseNumber(value);
    if (numeric > 0) return "success";
    if (numeric < 0) return "error";
    return "default";
  };

  useEffect(() => {
    setIsLoading(true);
    DashboardService.findAverageResolutionTimeByUserAssigned({
      manufacturingPlantId,
      userId: user.id,
    })
      .then(setAssignedSummary)
      .finally(() => setIsLoading(false));
  }, [manufacturingPlantId, user.id]);

  const metricCards = assignedSummary
    ? [
        {
          title: "Total hallazgos",
          value: assignedSummary.total,
          monthly: assignedSummary.total_mes_actual,
          previous: assignedSummary.total_mes_anterior,
          trend: assignedSummary.pct_total,
          icon: <Inventory2OutlinedIcon />,
        },
        {
          title: "Abiertas",
          value: assignedSummary.abiertas,
          monthly: assignedSummary.abiertas_mes_actual,
          previous: assignedSummary.abiertas_mes_anterior,
          trend: assignedSummary.pct_abiertas,
          icon: <PendingActionsOutlinedIcon />,
        },
        {
          title: "Cerradas",
          value: assignedSummary.cerradas,
          monthly: assignedSummary.cerradas_mes_actual,
          previous: assignedSummary.cerradas_mes_anterior,
          trend: assignedSummary.pct_cerradas,
          icon: <PlaylistAddCheckCircleOutlinedIcon />,
        },
        {
          title: "Canceladas",
          value: assignedSummary.canceladas,
          monthly: assignedSummary.canceladas_mes_actual,
          previous: assignedSummary.canceladas_mes_anterior,
          trend: assignedSummary.pct_canceladas,
          icon: <CancelScheduleSendOutlinedIcon />,
        },
      ]
    : [];

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Typography variant="h6">Hallazgos asignados · {user.name}</Typography>

        <Grid container spacing={2.5}>
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <Grid
                  key={`assigned-summary-skeleton-${index}`}
                  size={{ xs: 12, sm: 6, lg: 3 }}
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
            : metricCards.map((card) => (
                <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
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
                        {formatMetric(card.value)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {card.title}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {formatMetric(card.monthly)} este mes ·{" "}
                        {formatMetric(card.previous)} mes anterior
                      </Typography>

                      <Chip
                        size="small"
                        icon={getTrendIcon(card.trend)}
                        label={`${formatPercentage(card.trend)} vs mes anterior`}
                        color={getTrendColor(card.trend)}
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

export default AverageTimeByUserAssigned;
