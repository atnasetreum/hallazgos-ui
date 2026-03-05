import { useEffect, useMemo, useState } from "react";

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

import { MonthlySubtypeTrend } from "@interfaces";
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

const SubtypeTrendAdmin = ({ manufacturingPlantId }: Props) => {
  const [data, setData] = useState<MonthlySubtypeTrend[]>([]);

  useEffect(() => {
    DashboardService.findMonthlySubtypeTrend({ manufacturingPlantId }).then(
      setData,
    );
  }, [manufacturingPlantId]);

  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) => {
        const principalCompare = a.tipo_principal.localeCompare(
          b.tipo_principal,
        );
        if (principalCompare !== 0) return principalCompare;
        return a.tipo_secundario.localeCompare(b.tipo_secundario);
      }),
    [data],
  );

  const chartTitle = sortedData[0]?.planta
    ? `Incumplimientos por subtipo - ${sortedData[0].planta}`
    : "Incumplimientos por subtipo";

  const chartSubtitle = `Actualizado: ${new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())}`;

  const categories = sortedData.map((item) => item.tipo_secundario);

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

export default SubtypeTrendAdmin;
