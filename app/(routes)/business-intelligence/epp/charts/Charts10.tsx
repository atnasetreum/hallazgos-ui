"use client";

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

import type { BusinessIntelligenceEpp } from "@interfaces";

type Props = {
  data: BusinessIntelligenceEpp | null;
};

const toNumber = (value: string | number | null | undefined) =>
  Number(value ?? 0);

const Chart10 = ({ data }: Props) => {
  const rows = data?.chart10 ?? [];
  const categories = rows.map((row) => row.mes_label);
  const averageCost = rows.map((row) =>
    toNumber(row.gasto_promedio_por_empleado),
  );
  const weightedAverage = toNumber(data?.promedioGlobalChart10);

  const options: Highcharts.Options = {
    chart: {
      type: "spline",
    },
    title: {
      text: "Gasto Promedio por Empleado por Mes",
    },
    subtitle: {
      text: `Promedio global ponderado: $${Highcharts.numberFormat(weightedAverage, 2, ".", ",")}`,
    },
    xAxis: {
      categories,
      crosshair: true,
      labels: {
        rotation: -45,
        style: { fontSize: "11px" },
      },
    },
    yAxis: {
      min: 0,
      startOnTick: false,
      title: { text: "Gasto promedio ($)" },
      labels: {
        format: "${value:,.0f}",
      },
      plotLines: [
        {
          value: weightedAverage,
          color: "#e74c3c",
          dashStyle: "ShortDash",
          width: 2,
          label: {
            text: `Promedio global $${Highcharts.numberFormat(weightedAverage, 2, ".", ",")}`,
            align: "right",
            style: { color: "#e74c3c", fontSize: "11px" },
          },
        },
      ],
    },
    tooltip: {
      valuePrefix: "$",
      valueDecimals: 2,
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: true,
          radius: 5,
          symbol: "circle",
        },
      },
    },
    legend: { enabled: false },
    series: [
      {
        type: "spline",
        name: "Gasto promedio por empleado",
        color: "#2980b9",
        data: averageCost,
      },
    ],
    credits: { enabled: false },
  };

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart10;
