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

const Chart2 = ({ data }: Props) => {
  const rows = data?.chart2 ?? [];
  const categories = rows.map((row) => row.equipment_name);
  const prices = rows.map((row) => toNumber(row.precio_actual));

  const options: Highcharts.Options = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Precio Actual por Equipo EPP",
    },
    subtitle: {
      text: "Precio vigente registrado",
    },
    xAxis: {
      categories,
      title: { text: undefined },
      labels: {
        style: { fontSize: "12px" },
      },
    },
    yAxis: {
      min: 0,
      startOnTick: false,
      title: { text: "Precio ($)" },
      labels: {
        format: "${value:,.0f}",
      },
    },
    tooltip: {
      pointFormat: "Precio actual: <b>${point.y:,.2f}</b>",
    },
    plotOptions: {
      bar: {
        borderWidth: 0,
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          format: "${point.y:,.2f}",
          style: { fontSize: "11px" },
        },
      },
    },
    legend: { enabled: false },
    series: [
      {
        type: "bar",
        name: "Precio actual",
        color: "#2980b9",
        data: prices,
      },
    ],
    credits: { enabled: false },
  };

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart2;
