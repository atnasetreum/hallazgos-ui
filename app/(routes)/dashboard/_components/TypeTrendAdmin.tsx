import { useEffect, useMemo, useState } from "react";

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

import { MonthlyTypeTrend } from "@interfaces";
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

const TypeTrendAdmin = ({ manufacturingPlantId }: Props) => {
  const [data, setData] = useState<MonthlyTypeTrend[]>([]);

  useEffect(() => {
    DashboardService.findMonthlyTypeTrend({ manufacturingPlantId }).then(
      setData,
    );
  }, [manufacturingPlantId]);

  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.tipo_principal.localeCompare(b.tipo_principal),
      ),
    [data],
  );

  const chartTitle = sortedData[0]?.planta
    ? `Incumplimientos por tipo - ${sortedData[0].planta}`
    : "Incumplimientos por tipo";

  const chartSubtitle = `Actualizado: ${new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())}`;

  const categories = sortedData.map((item) => item.tipo_principal);

  const series = [
    {
      type: "column",
      name: "Histórico",
      data: sortedData.map((item) => parseNumber(item.total_historico)),
    },
    {
      type: "column",
      name: "Mes actual",
      data: sortedData.map((item) => parseNumber(item.total_mes_actual)),
    },
    {
      type: "column",
      name: "Mes anterior",
      data: sortedData.map((item) => parseNumber(item.total_mes_anterior)),
    },
    {
      type: "line",
      name: "% Cambio",
      data: sortedData.map((item) => parseNumber(item.pct_cambio)),
      yAxis: 1,
    },
  ] as Highcharts.SeriesOptionsType[];

  return (
    <Chart
      highcharts={Highcharts}
      options={{
        chart: { type: "column" },
        title: { text: chartTitle },
        subtitle: { text: chartSubtitle },
        xAxis: {
          categories,
        },
        yAxis: [
          { title: { text: "Totales" } },
          { title: { text: "% Cambio" }, opposite: true },
        ],
        tooltip: { shared: true },
        series,
      }}
    />
  );
};

export default TypeTrendAdmin;
