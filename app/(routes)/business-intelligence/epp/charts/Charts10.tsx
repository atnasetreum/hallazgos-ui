"use client";

// 3. Gasto promedio por empleado por mes
// Cuánto cuesta en promedio equipar a un empleado cada mes. Los datos muestran una variación enorme: desde $67 hasta $656 por empleado dependiendo del mes — útil para presupuestación y detectar meses atípicos.

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

const gastoPromedio = [
  656.5, 365.86, 67.89, 85.5, 451.15, 407.1, 170.65, 134.54,
];
const empleadosEntrega = [1, 119, 100, 94, 75, 31, 196, 45];
const gastoTotal = [
  656.5, 43537.5, 6789.0, 8037.0, 33836.0, 12620.0, 33448.0, 6054.5,
];

// Promedio global ponderado
const promedioGlobal = parseFloat(
  (
    gastoTotal.reduce((a, b) => a + b, 0) /
    empleadosEntrega.reduce((a, b) => a + b, 0)
  ).toFixed(2),
);

const options = {
  chart: {
    type: "spline",
  },
  title: {
    text: "Gasto Promedio por Empleado por Mes",
  },
  subtitle: {
    text: `Planta 2 — promedio global ponderado: $${Highcharts.numberFormat(promedioGlobal, 2, ".", ",")}`,
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
      formatter() {
        return `$${Highcharts.numberFormat(this.value, 0, ".", ",")}`;
      },
    },
    plotLines: [
      {
        value: promedioGlobal,
        color: "#e74c3c",
        dashStyle: "ShortDash",
        width: 2,
        label: {
          text: `Promedio global $${Highcharts.numberFormat(promedioGlobal, 2, ".", ",")}`,
          align: "right",
          style: { color: "#e74c3c", fontSize: "11px" },
        },
      },
    ],
  },
  tooltip: {
    shared: true,
    formatter() {
      const index = this.points[0].point.index;
      const label = categories[index];
      const empleados = empleadosEntrega[index];
      const total = gastoTotal[index];
      const promedio = gastoPromedio[index];

      const anterior = index > 0 ? gastoPromedio[index - 1] : null;
      const diff = anterior !== null ? promedio - anterior : null;
      const pct =
        anterior > 0 ? parseFloat(((diff / anterior) * 100).toFixed(2)) : null;

      const variacion =
        pct !== null
          ? `<br/><span style="color:${pct >= 0 ? "#e74c3c" : "#27ae60"}">
            ${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct)}% vs mes anterior
           </span>`
          : "";

      return `<b>${label}</b><br/>
        <span style="color:#2980b9">●</span> Gasto promedio: <b>$${Highcharts.numberFormat(promedio, 2, ".", ",")}</b>
        ${variacion}<br/>
        <span style="color:#aaa">─────────────</span><br/>
        <span style="color:#888">● Gasto total: <b>$${Highcharts.numberFormat(total, 2, ".", ",")}</b></span><br/>
        <span style="color:#888">● Empleados con entrega: <b>${empleados}</b></span>`;
    },
  },
  plotOptions: {
    spline: {
      marker: {
        enabled: true,
        radius: 5,
        symbol: "circle",
      },
      zones: [
        {
          value: promedioGlobal,
          color: "#27ae60",
        },
        {
          color: "#e74c3c",
        },
      ],
    },
  },
  legend: { enabled: false },
  series: [
    {
      name: "Gasto promedio por empleado",
      data: [656.5, 365.86, 67.89, 85.5, 451.15, 407.1, 170.65, 134.54],
    },
  ],
  credits: { enabled: false },
};

const Chart10 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart10;
