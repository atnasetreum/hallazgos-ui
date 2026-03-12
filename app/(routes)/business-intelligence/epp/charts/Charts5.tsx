"use client";

// Empleados que no han recibido ninguna entrega en el mes actual"
// es decir, empleados activos de la planta que en este mes no aparecen en ningún EPP. Le dice al administrador quién se está quedando sin reposición, que es justamente el riesgo operativo real.

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

const totalActivos = 529;
const conActual = 45;
const sinActual = 484;
const pctConActual = 8.51;
const pctSinActual = 91.49;
const conAnterior = 196;
const sinAnterior = 333;
const pctConAnterior = 37.05;
const pctSinAnterior = 62.95;

const options = {
  chart: {
    type: "pie",
  },
  title: {
    text: "Cobertura de Entregas EPP",
    style: { fontSize: "16px" },
  },
  subtitle: {
    text: `Planta 2 — ${totalActivos} empleados activos`,
  },
  plotOptions: {
    pie: {
      shadow: false,
      borderWidth: 2,
    },
  },
  tooltip: {
    formatter() {
      return `<b>${this.series.name}</b><br/>
        <span style="color:${this.point.color}">●</span> ${this.point.name}: <b>${this.point.y} empleados</b><br/>
        <span style="color:#888">${this.point.percentage.toFixed(2)}% del total</span>`;
    },
  },
  series: [
    {
      name: "Mes Anterior",
      size: "60%",
      innerSize: "30%",
      dataLabels: {
        formatter() {
          return this.point.percentage > 5
            ? `<b>${this.point.name}</b><br/>${this.point.percentage.toFixed(1)}%`
            : null;
        },
        distance: -40,
        style: { fontSize: "11px", color: "#fff", textOutline: "none" },
      },
      data: [
        { name: "Con entrega", y: conAnterior, color: "#27ae60" },
        { name: "Sin entrega", y: sinAnterior, color: "#e74c3c" },
      ],
    },
    {
      name: "Mes Actual",
      size: "100%",
      innerSize: "65%",
      dataLabels: {
        formatter() {
          return this.point.percentage > 5
            ? `<b>${this.point.name}</b><br/>${this.point.percentage.toFixed(1)}%`
            : null;
        },
        distance: 10,
        style: { fontSize: "12px" },
      },
      data: [
        { name: "Con entrega", y: conActual, color: "#2ecc71" },
        { name: "Sin entrega", y: sinActual, color: "#c0392b" },
      ],
    },
  ],
  credits: { enabled: false },
};
const Chart5 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart5;
