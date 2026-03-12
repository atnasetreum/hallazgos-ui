"use client";

// 1. Gasto total histórico mensual
// Evolución del gasto mes a mes. Con los datos reales se ven picos claros (Sep 2025: $43k, Dic 2025: $33k) que el administrador necesita entender y justificar. Mes actual vs mes anterior incluido.

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

const gastoTotal = [
  656.5, 43537.5, 6789.0, 8037.0, 33836.0, 12620.0, 33448.0, 6054.5,
];
const empleadosEntrega = [1, 119, 100, 94, 75, 31, 196, 45];
const unidadesTotal = [3, 175, 126, 111, 111, 45, 252, 50];

const options = {
  chart: {
    type: "column",
  },
  title: {
    text: "Gasto Total Histórico en EPP",
  },
  subtitle: {
    text: "Planta 2 — gasto mensual acumulado",
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
        formatter() {
          return `$${Highcharts.numberFormat(this.value, 0, ".", ",")}`;
        },
      },
    },
    {
      min: 0,
      startOnTick: false,
      allowDecimals: false,
      title: { text: "Empleados con entrega" },
      opposite: true,
      labels: {
        formatter() {
          return Highcharts.numberFormat(this.value, 0);
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    formatter() {
      const index = this.points[0].point.index;
      const label = categories[index];
      const unidades = unidadesTotal[index];

      // Variación vs mes anterior
      const gastoActual = gastoTotal[index];
      const gastoAnterior = index > 0 ? gastoTotal[index - 1] : null;
      const diff = gastoAnterior !== null ? gastoActual - gastoAnterior : null;
      const pct =
        gastoAnterior > 0
          ? parseFloat(((diff / gastoAnterior) * 100).toFixed(2))
          : null;

      const rows = this.points.map(
        (p) =>
          `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${
            p.series.name === "Empleados con entrega"
              ? Highcharts.numberFormat(p.y, 0)
              : `$${Highcharts.numberFormat(p.y, 2, ".", ",")}`
          }</b>`,
      );

      const variacion =
        pct !== null
          ? `<br/><span style="color:${pct >= 0 ? "#e74c3c" : "#27ae60"}">
            ${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct)}% vs mes anterior
           </span>`
          : "";

      return `<b>${label}</b><br/>
        ${rows.join("<br/>")}<br/>
        <span style="color:#aaa">─────────────</span><br/>
        <span style="color:#888">● Unidades entregadas: <b>${unidades}</b></span>
        ${variacion}`;
    },
  },
  plotOptions: {
    column: {
      borderWidth: 0,
      borderRadius: 4,
    },
  },
  series: [
    {
      name: "Gasto total",
      type: "column",
      yAxis: 0,
      color: "#2980b9",
      data: [656.5, 43537.5, 6789.0, 8037.0, 33836.0, 12620.0, 33448.0, 6054.5],
    },
    {
      name: "Empleados con entrega",
      type: "line",
      yAxis: 1,
      color: "#e67e22",
      dashStyle: "ShortDash",
      marker: { enabled: true, radius: 4 },
      data: [1, 119, 100, 94, 75, 31, 196, 45],
    },
  ],
  credits: { enabled: false },
};
const Chart8 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart8;
