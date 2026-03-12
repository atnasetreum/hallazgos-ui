"use client";

// Empleados que recibieron EPP por primera vez este mes
// Empleados nuevos en el sistema de EPP (primera entrega registrada). Ayuda a cruzar con altas de personal.

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

const primera_vez_mes_actual = 25;
const primera_vez_mes_anterior = 171;
const diferencia = -146;
const pct =
  primera_vez_mes_anterior > 0
    ? parseFloat(
        (
          ((primera_vez_mes_actual - primera_vez_mes_anterior) /
            primera_vez_mes_anterior) *
          100
        ).toFixed(2),
      )
    : 0;

const options = {
  chart: {
    type: "column",
  },
  title: {
    text: "Empleados con Primera Entrega de EPP",
  },
  subtitle: {
    text: "Planta 2 — mes actual vs mes anterior",
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
    formatter() {
      const index = this.points[0].point.index;
      const labels = ["Mes Anterior", "Mes Actual"];
      const valores = [primera_vez_mes_anterior, primera_vez_mes_actual];
      const color = pct >= 0 ? "#e74c3c" : "#27ae60";
      const arrow = pct >= 0 ? "▲" : "▼";
      const extra =
        index === 1
          ? `<br/><span style="color:${color}">${arrow} ${Math.abs(pct)}% vs mes anterior</span>`
          : "";
      return `<b>${labels[index]}</b><br/>
        <span style="color:${this.points[0].color}">●</span> Empleados nuevos en EPP: <b>${valores[index]}</b>${extra}`;
    },
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
      name: "Empleados nuevos en EPP",
      data: [
        { y: primera_vez_mes_anterior, color: "#95a5a6" },
        { y: primera_vez_mes_actual, color: "#2980b9" },
      ],
    },
  ],
  credits: { enabled: false },
};

const Chart6 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart6;
