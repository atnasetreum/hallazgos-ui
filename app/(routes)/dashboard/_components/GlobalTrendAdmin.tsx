import { useEffect, useMemo, useState } from "react";

import Highcharts from "highcharts/highcharts.src";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting";
import "highcharts/esm/modules/drilldown";
import { useTheme } from "@mui/material/styles";

import { DashboardService } from "@services";
import { MonthlyGlobalTrend, User } from "@interfaces";
import { ROLE_ADMINISTRADOR } from "@shared/constants";
import { useUserSessionStore } from "@store";

//import { optionsChartDefault } from "@shared/libs";

const parseNumber = (value: string | number | null | undefined) => {
  if (typeof value === "number") return value;
  const parsed = Number(
    String(value ?? "")
      .replace(/,/g, "")
      .trim(),
  );
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatMonth = (value: Date | string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const month = new Intl.DateTimeFormat("es-MX", {
    month: "short",
  })
    .format(date)
    .replace(".", "");

  return month.charAt(0).toUpperCase() + month.slice(1);
};

interface Props {
  manufacturingPlantId: string;
  user?: User;
  isAdmin?: boolean;
}

const GlobalTrendAdmin = ({ manufacturingPlantId, user }: Props) => {
  const theme = useTheme();
  const [monthlyGlobalTrends, setMonthlyGlobalTrends] = useState<
    MonthlyGlobalTrend[]
  >([]);

  useEffect(() => {
    DashboardService.findMonthlyGlobalTrend({
      manufacturingPlantId,
      userId: user?.id || 0,
      isAdmin: !user ? true : false,
    }).then(setMonthlyGlobalTrends);
  }, [manufacturingPlantId, user]);

  const sortedTrends = useMemo(() => {
    return [...monthlyGlobalTrends].sort(
      (a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime(),
    );
  }, [monthlyGlobalTrends]);

  const chartTitle = sortedTrends[0]?.planta
    ? `Tendencia global mensual - ${sortedTrends[0].planta}`
    : "Tendencia global mensual";

  const chartSubtitle = `Actualizado: ${new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())}`;

  const categories = sortedTrends.map((item) => formatMonth(item.mes));

  const series = [
    {
      type: "column",
      name: "Abiertas",
      data: sortedTrends.map((item) => parseNumber(item.abiertas)),
    },
    {
      type: "column",
      name: "Cerradas",
      data: sortedTrends.map((item) => parseNumber(item.cerradas)),
    },
    {
      type: "column",
      name: "Canceladas",
      data: sortedTrends.map((item) => parseNumber(item.canceladas)),
    },
    {
      type: "line",
      name: "Backlog acumulado",
      data: sortedTrends.map((item) => parseNumber(item.backlog_acumulado)),
      yAxis: 0,
    },
    {
      type: "line",
      name: "% Resolución",
      data: sortedTrends.map((item) => parseNumber(item.pct_resolucion)),
      yAxis: 1,
    },
  ] as Highcharts.SeriesOptionsType[];

  return (
    <Chart
      highcharts={Highcharts}
      options={{
        //...optionsChartDefault,
        //chart: { zoomType: "xy" },
        title: { text: chartTitle },
        subtitle: { text: chartSubtitle },
        xAxis: {
          categories,
        },
        yAxis: [
          {
            // Eje principal
            title: { text: "Casos" },
          },
          {
            // Eje secundario
            title: { text: "% Resolución" },
            labels: { format: "{value}%" },
            opposite: true,
          },
        ],
        legend: {
          itemStyle: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.text.primary,
          },
          itemHoverStyle: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.text.primary,
          },
          itemHiddenStyle: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.grey[500]
                : theme.palette.text.disabled,
          },
        },
        tooltip: { shared: true },
        plotOptions: { column: { stacking: "normal" } },
        series,
      }}
    />
  );
};

export default GlobalTrendAdmin;
