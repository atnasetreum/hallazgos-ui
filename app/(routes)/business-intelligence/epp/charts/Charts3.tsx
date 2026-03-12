"use client";

//Entregas fuera de rango (outOfRangeDelivery) — mes actual vs mes anterior
//Cuántas entregas se hicieron antes de que el empleado tuviera derecho a recibirlas. Es un indicador de control interno que al admin le interesa vigilar.

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

const categories = [
  "Ago 2025",
  "Sep 2025",
  "Oct 2025",
  "Nov 2025",
  "Dic 2025",
  "Ene 2026",
  "Feb 2026",
  "Mar 2026",
];

const options = {
  chart: {
    type: "column",
  },
  title: {
    text: "Entregas en Rango vs Fuera de Rango — Histórico",
  },
  subtitle: {
    text: "Planta 2 — mes a mes",
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
      labels: {
        formatter() {
          return Highcharts.numberFormat(this.value, 0);
        },
      },
    },
    {
      min: 0,
      max: 100,
      title: { text: "% Fuera de rango" },
      labels: {
        formatter() {
          return `${this.value}%`;
        },
      },
      opposite: true,
    },
  ],
  tooltip: {
    shared: true,
    formatter() {
      const index = this.points[0].point.index;
      const label = categories[index];
      const rows = this.points.map(
        (p) =>
          `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${
            p.series.name === "% Fuera de rango"
              ? `${Highcharts.numberFormat(p.y, 2)}%`
              : Highcharts.numberFormat(p.y, 0)
          }</b>`,
      );
      return `<b>${label}</b><br/>${rows.join("<br/>")}`;
    },
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
      name: "En rango",
      type: "column",
      yAxis: 0,
      color: "#27ae60",
      data: [3, 175, 126, 111, 111, 45, 252, 50],
    },
    {
      name: "Fuera de rango",
      type: "column",
      yAxis: 0,
      color: "#e74c3c",
      data: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "% Fuera de rango",
      type: "line",
      yAxis: 1,
      color: "#e67e22",
      dashStyle: "ShortDash",
      marker: { enabled: true, radius: 4 },
      data: [0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
  credits: { enabled: false },
};

const Chart3 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart3;
