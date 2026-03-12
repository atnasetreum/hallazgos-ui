"use client";

//Evolución de precios por equipo (histórico)
//Usando equipment_cost_history, mostrar cómo ha cambiado el precio de cada equipo a lo largo del tiempo. Identifica inflación o cambios de proveedor.

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

const categories = [
  "BOTA DE SEGURIDAD",
  "MANDIL",
  "GUANTES NEGROS",
  "RESPIRADOR",
  "CASCO",
  "GUANTE VERDE PARA QUIMICOS",
  "GUANTES BLANCOS",
  "MANGAS",
  "LENTES DE SEGURIDAD",
  "TAPON AUDITIVO",
  "GUANTE NEOPRENO",
];

const options = {
  chart: {
    type: "bar",
  },
  title: {
    text: "Precio Actual por Equipo EPP",
  },
  subtitle: {
    text: "Planta 2 — precio vigente registrado",
  },
  xAxis: {
    categories,
    title: { text: null },
    labels: {
      style: { fontSize: "12px" },
    },
  },
  yAxis: {
    min: 0,
    startOnTick: false,
    title: { text: "Precio ($)" },
    labels: {
      formatter() {
        return `$${Highcharts.numberFormat(this.value, 0, ".", ",")}`;
      },
    },
  },
  tooltip: {
    formatter() {
      const index = this.point.index;
      const label = categories[index];
      return `<b>${label}</b><br/>
        Precio actual: <b>$${Highcharts.numberFormat(this.y, 2, ".", ",")}</b>`;
    },
  },
  plotOptions: {
    bar: {
      borderWidth: 0,
      borderRadius: 4,
      dataLabels: {
        enabled: true,
        formatter() {
          return `$${Highcharts.numberFormat(this.y, 2, ".", ",")}`;
        },
        style: { fontSize: "11px" },
      },
    },
  },
  legend: { enabled: false },
  series: [
    {
      name: "Precio actual",
      color: "#2980b9",
      data: [539, 107, 97.5, 60, 70, 50, 22.5, 16.5, 20, 5, 3],
    },
  ],
  credits: { enabled: false },
};
``;

const Chart2 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart2;
