"use client";

// Top equipos más entregados este mes
// Ranking de los EPP con mayor volumen de entrega en el mes. Útil para planificación de inventario.

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

const categories = [
  "GUANTES NEGROS",
  "TAPON AUDITIVO",
  "BOTA DE SEGURIDAD",
  "MANDIL",
  "LENTES DE SEGURIDAD",
  "GUANTES BLANCOS",
  "GUANTE NEOPRENO",
  "MANGAS",
  "CASCO",
  "GUANTE VERDE PARA QUIMICOS",
];

const empleadosActual = [24, 11, 6, 3, 2, 2, 1, 1, 0, 0];
const empleadosAnterior = [63, 76, 42, 20, 21, 5, 2, 1, 3, 6];

const options = {
  chart: {
    type: "column",
  },
  title: {
    text: "Top Equipos Más Entregados — Mes Actual vs Mes Anterior",
  },
  subtitle: {
    text: "Planta 2 — unidades entregadas por equipo",
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
    labels: {
      formatter() {
        return Highcharts.numberFormat(this.value, 0);
      },
    },
  },
  tooltip: {
    shared: true,
    formatter() {
      const index = this.points[0].point.index;
      const label = categories[index];
      const empActual = empleadosActual[index];
      const empAnterior = empleadosAnterior[index];
      const rows = this.points.map(
        (p) =>
          `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${Highcharts.numberFormat(p.y, 0)} uds</b>`,
      );
      return `<b>${label}</b><br/>
        ${rows.join("<br/>")}<br/>
        <span style="color:#aaa">─────────────</span><br/>
        <span style="color:#888">● Empleados mes actual: <b>${empActual}</b></span><br/>
        <span style="color:#888">● Empleados mes anterior: <b>${empAnterior}</b></span>`;
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
      data: [74, 78, 42, 20, 21, 5, 2, 1, 3, 6],
    },
    {
      name: "Mes Actual",
      color: "#2980b9",
      data: [24, 11, 6, 3, 2, 2, 1, 1, 0, 0],
    },
  ],
  credits: { enabled: false },
};

const Chart4 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart4;
