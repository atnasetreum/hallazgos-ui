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

const Chart6 = ({ data }: Props) => {
  const row = data?.chart6?.[0];
  const currentMonth = toNumber(row?.primera_vez_mes_actual);
  const previousMonth = toNumber(row?.primera_vez_mes_anterior);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Empleados con Primera Entrega de EPP",
    },
    subtitle: {
      text: "Mes actual vs mes anterior",
    },
    xAxis: {
      categories: ["Mes Anterior", "Mes Actual"],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      startOnTick: false,
      allowDecimals: false,
      title: { text: "Empleados" },
    },
    tooltip: {
      shared: true,
      pointFormat:
        '<span style="color:{point.color}">●</span> Empleados nuevos en EPP: <b>{point.y}</b>',
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          style: { fontSize: "13px" },
        },
      },
    },
    legend: { enabled: false },
    series: [
      {
        type: "column",
        name: "Empleados nuevos en EPP",
        data: [
          { y: previousMonth, color: "#95a5a6" },
          { y: currentMonth, color: "#2980b9" },
        ],
      },
    ],
    credits: { enabled: false },
  };

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart6;
