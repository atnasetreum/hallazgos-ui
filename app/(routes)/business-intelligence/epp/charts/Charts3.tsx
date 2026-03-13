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

const Chart3 = ({ data }: Props) => {
  const rows = data?.chart3 ?? [];
  const categories = rows.map((row) => row.mes_label);
  const inRange = rows.map((row) => toNumber(row.en_rango));
  const outOfRange = rows.map((row) => toNumber(row.fuera_de_rango));
  const outOfRangePct = rows.map((row) => toNumber(row.pct_fuera_de_rango));

  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Entregas en Rango vs Fuera de Rango - Historico",
    },
    xAxis: {
      categories,
      crosshair: true,
    },
    yAxis: [
      {
        min: 0,
        startOnTick: false,
        title: { text: "Cantidad de entregas" },
      },
      {
        min: 0,
        max: 100,
        title: { text: "% Fuera de rango" },
        labels: { format: "{value}%" },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        borderWidth: 0,
        borderRadius: 3,
      },
    },
    legend: {
      enabled: true,
    },
    series: [
      {
        type: "column",
        name: "En rango",
        yAxis: 0,
        color: "#27ae60",
        data: inRange,
      },
      {
        type: "column",
        name: "Fuera de rango",
        yAxis: 0,
        color: "#e74c3c",
        data: outOfRange,
      },
      {
        type: "line",
        name: "% Fuera de rango",
        yAxis: 1,
        color: "#e67e22",
        dashStyle: "ShortDash",
        marker: { enabled: true, radius: 4 },
        data: outOfRangePct,
        tooltip: { valueSuffix: "%" },
      },
    ],
    credits: { enabled: false },
  };

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart3;
