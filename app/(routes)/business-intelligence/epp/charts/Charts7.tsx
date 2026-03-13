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

const Chart7 = ({ data }: Props) => {
  const rows = data?.chart7 ?? [];
  const categories = rows.map((row) => row.equipment_name);
  const employees = rows.map((row) =>
    toNumber(row.empleados_nuevos_que_lo_recibieron),
  );

  const options: Highcharts.Options = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Equipos Entregados a Empleados Nuevos en EPP",
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
      allowDecimals: false,
      title: { text: "Empleados nuevos que lo recibieron" },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{point.color}">●</span> Empleados nuevos que lo recibieron: <b>{point.y}</b>',
    },
    plotOptions: {
      bar: {
        borderWidth: 0,
        borderRadius: 4,
        colorByPoint: true,
        colors: ["#2980b9"],
        dataLabels: {
          enabled: true,
          style: { fontSize: "11px" },
        },
      },
    },
    legend: { enabled: false },
    series: [
      {
        type: "bar",
        name: "Empleados nuevos",
        data: employees,
      },
    ],
    credits: { enabled: false },
  };

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart7;
