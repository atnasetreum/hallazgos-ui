"use client";

// Empleados que recibieron EPP por primera vez este mes
// Empleados nuevos en el sistema de EPP (primera entrega registrada). Ayuda a cruzar con altas de personal.

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";
const categories = [
  "GUANTES NEGROS",
  "TAPON AUDITIVO",
  "BOTA DE SEGURIDAD",
  "MANDIL",
  "GUANTES BLANCOS",
];

const options = {
  chart: {
    type: "bar",
  },
  title: {
    text: "Equipos Entregados a Empleados Nuevos en EPP",
  },
  subtitle: {
    text: "Planta 2 — mes actual (25 empleados con primera entrega)",
  },
  xAxis: {
    categories: categories,
    title: { text: null },
    labels: {
      style: { fontSize: "12px" },
    },
  },
  yAxis: {
    min: 0,
    startOnTick: false,
    allowDecimals: false,
    title: { text: "Empleados nuevos que lo recibieron" },
    labels: {
      formatter() {
        return Highcharts.numberFormat(this.value, 0);
      },
    },
  },
  tooltip: {
    formatter() {
      const index = this.point.index;
      const label = categories2[index];
      return `<b>${label}</b><br/>
        <span style="color:${this.point.color}">●</span> Empleados nuevos que lo recibieron: <b>${this.y}</b>`;
    },
  },
  plotOptions: {
    bar: {
      borderWidth: 0,
      borderRadius: 4,
      colorByPoint: true,
      colors: ["#2980b9", "#2980b9", "#2980b9", "#2980b9", "#2980b9"],
      dataLabels: {
        enabled: true,
        style: { fontSize: "11px" },
      },
    },
  },
  legend: { enabled: false },
  series: [
    {
      name: "Empleados nuevos",
      data: [12, 7, 5, 2, 1],
    },
  ],
  credits: { enabled: false },
};

const Chart7 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart7;
