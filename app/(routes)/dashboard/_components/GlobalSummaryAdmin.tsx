import { useEffect, useState } from "react";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
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
import { GlobalSummary } from "@interfaces";

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

export const GlobalSummaryAdmin = ({ manufacturingPlantId }: Props) => {
  const [globalSummary, setGlobalSummary] = useState<GlobalSummary | null>(
    null,
  );

  useEffect(() => {
    DashboardService.findGlobalSummary({ manufacturingPlantId }).then(
      setGlobalSummary,
    );
  }, [manufacturingPlantId]);

  const summaryCards = globalSummary
    ? [
        {
          title: "Total hallazgos",
          value: globalSummary.total,
          monthly: `${formatMetric(globalSummary.total_mes_actual)} este mes`,
          detail: `${formatMetric(globalSummary.total_mes_anterior)} mes anterior`,
          trend: globalSummary.pct_total,
          icon: <AssignmentTurnedInIcon />,
        },
        {
          title: "Abiertas",
          value: globalSummary.abiertas,
          monthly: `${formatMetric(globalSummary.abiertas_mes_actual)} este mes`,
          detail: `${formatMetric(globalSummary.abiertas_mes_anterior)} mes anterior`,
          trend: globalSummary.pct_abiertas,
          icon: <PendingActionsIcon />,
        },
        {
          title: "Cerradas",
          value: globalSummary.cerradas,
          monthly: `${formatMetric(globalSummary.cerradas_mes_actual)} este mes`,
          detail: `${formatMetric(globalSummary.cerradas_mes_anterior)} mes anterior`,
          trend: globalSummary.pct_cerradas,
          icon: <PlaylistAddCheckCircleIcon />,
        },
        {
          title: "Canceladas",
          value: globalSummary.canceladas,
          monthly: `${formatMetric(globalSummary.canceladas_mes_actual)} este mes`,
          detail: `${formatMetric(globalSummary.canceladas_mes_anterior)} mes anterior`,
          trend: globalSummary.pct_canceladas,
          icon: <CancelScheduleSendIcon />,
        },
      ]
    : [];

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography variant="h6">
            Resumen global{" "}
            {globalSummary?.planta ? `· ${globalSummary.planta}` : ""}
          </Typography>
          {globalSummary && (
            <Chip
              label={`Resolución histórica: ${formatPercentage(globalSummary.pct_resolucion_historica)}`}
              color="primary"
              variant="filled"
              size="small"
            />
          )}
        </Stack>

        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          {globalSummary
            ? summaryCards.map((card) => (
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
                        {card.monthly} · {card.detail}
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
              ))
            : Array.from({ length: 4 }, (_, index) => (
                <Grid
                  key={`summary-skeleton-${index}`}
                  size={{ xs: 12, sm: 6, lg: 3 }}
                >
                  <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                    <Stack spacing={1.25}>
                      <Skeleton variant="rounded" width={40} height={40} />
                      <Skeleton variant="text" height={44} width="60%" />
                      <Skeleton variant="text" height={22} width="45%" />
                      <Skeleton variant="text" height={20} width="100%" />
                      <Skeleton variant="rounded" width={170} height={28} />
                    </Stack>
                  </Paper>
                </Grid>
              ))}
        </Grid>
      </Stack>
    </Paper>
  );
};

export default GlobalSummaryAdmin;
