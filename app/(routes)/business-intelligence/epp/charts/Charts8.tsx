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

const Chart8 = ({ data }: Props) => {
  const rows = data?.chart8 ?? [];
  const categories = rows.map((row) => row.mes_label);
  const totalCost = rows.map((row) => toNumber(row.gasto_total));
  const employeesWithDelivery = rows.map((row) =>
    toNumber(row.empleados_con_entrega),
  );
  const totalUnits = rows.map((row) => toNumber(row.unidades_total));
  const totalUnitsAccumulated = totalUnits.reduce(
    (acc, value) => acc + value,
    0,
  );

  const options: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Gasto Total Historico en EPP",
    },
    subtitle: {
      text: `Unidades acumuladas: ${Highcharts.numberFormat(totalUnitsAccumulated, 0)}`,
    },
    xAxis: {
      categories,
      crosshair: true,
      labels: {
        rotation: -45,
        style: { fontSize: "11px" },
      },
    },
    yAxis: [
      {
        min: 0,
        startOnTick: false,
        title: { text: "Gasto ($)" },
        labels: {
          format: "${value:,.0f}",
        },
      },
      {
        min: 0,
        startOnTick: false,
        allowDecimals: false,
        title: { text: "Empleados con entrega" },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
      valueDecimals: 2,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderRadius: 4,
      },
    },
    series: [
      {
        type: "column",
        name: "Gasto total",
        yAxis: 0,
        color: "#2980b9",
        data: totalCost,
      },
      {
        type: "line",
        name: "Empleados con entrega",
        yAxis: 1,
        color: "#e67e22",
        dashStyle: "ShortDash",
        marker: { enabled: true, radius: 4 },
        data: employeesWithDelivery,
      },
    ],
    credits: { enabled: false },
  };

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart8;
