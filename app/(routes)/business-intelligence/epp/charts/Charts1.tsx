"use client";

// Gasto mensual actual vs mes anterior
// Cuánto se gastó en EPP este mes comparado con el mes pasado, por tipo de equipo. El administrador detecta de inmediato si el gasto se disparó.

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

const categories = [
  "BOTA DE SEGURIDAD",
  "GUANTES NEGROS",
  "MANDIL",
  "TAPON AUDITIVO",
  "GUANTES BLANCOS",
  "LENTES DE SEGURIDAD",
  "MANGAS",
  "GUANTE NEOPRENO",
  "RESPIRADOR",
  "CASCO",
  "GUANTE VERDE PARA QUIMICOS",
];

const variaciones = [
  -85.71, -67.57, -85.0, -85.9, -60.0, -90.48, 0.0, -50.0, 0, -100.0, -100.0,
];

const options = {
  chart: {
    type: "column",
  },
  title: {
    text: "Gasto en EPP — Mes Actual vs Mes Anterior",
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
      formatter() {
        return `$${Highcharts.numberFormat(this.value, 0, ".", ",")}`;
      },
    },
  },
  tooltip: {
    shared: true,
    formatter() {
      const index = this.points[0].point.index;
      const nombre = categories[index];
      const pct = variaciones[index];
      const points = this.points.map(
        (p) =>
          `<span style="color:${p.color}">●</span> ${p.series.name}: <b>$${Highcharts.numberFormat(p.y, 2, ".", ",")}</b>`,
      );
      const variacion = `<br/><span style="color:${pct > 0 ? "#e74c3c" : pct < 0 ? "#27ae60" : "#888"}">
        ${pct > 0 ? "▲" : pct < 0 ? "▼" : "–"} ${Math.abs(pct)}%
      </span>`;
      return `<b>${nombre}</b><br/>${points.join("<br/>")}${variacion}`;
    },
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
      name: "Mes Anterior",
      color: "#95a5a6",
      data: [22638, 7215, 2140, 390, 112.5, 420, 16.5, 6, 0, 210, 300],
    },
    {
      name: "Mes Actual",
      color: "#2980b9",
      data: [3234, 2340, 321, 55, 45, 40, 16.5, 3, 0, 0, 0],
    },
  ],
  credits: { enabled: false },
};

const Chart1 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart1;
