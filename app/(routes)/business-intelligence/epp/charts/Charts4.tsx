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

const Chart4 = ({ data }: Props) => {
  const rows = data?.chart4 ?? [];
  const categories = rows.map((row) => row.equipment_name);
  const previousMonth = rows.map((row) => toNumber(row.unidades_mes_anterior));
  const currentMonth = rows.map((row) => toNumber(row.unidades_mes_actual));

  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Top Equipos Mas Entregados - Mes Actual vs Mes Anterior",
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
      allowDecimals: false,
      title: { text: "Unidades entregadas" },
    },
    tooltip: {
      shared: true,
      valueSuffix: " uds",
      valueDecimals: 0,
    },
    plotOptions: {
      column: {
        grouping: true,
        borderWidth: 0,
        borderRadius: 4,
      },
    },
    series: [
      {
        type: "column",
        name: "Mes Anterior",
        color: "#95a5a6",
        data: previousMonth,
      },
      {
        type: "column",
        name: "Mes Actual",
        color: "#2980b9",
        data: currentMonth,
      },
    ],
    credits: { enabled: false },
  };

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart4;
