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

const Chart1 = ({ data }: Props) => {
  const rows = data?.chart1 ?? [];
  const categories = rows.map((row) => row.equipment_name);
  const previousMonth = rows.map((row) => toNumber(row.gasto_mes_anterior));
  const currentMonth = rows.map((row) => toNumber(row.gasto_mes_actual));

  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Gasto en EPP - Mes Actual vs Mes Anterior",
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
      title: { text: "Gasto ($)" },
      labels: {
        format: "${value:,.0f}",
      },
    },
    tooltip: {
      shared: true,
      valuePrefix: "$",
      valueDecimals: 2,
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

export default Chart1;
