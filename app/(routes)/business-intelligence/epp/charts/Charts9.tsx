"use client";

// 2. Participación de costo por equipo (acumulado)
// Qué porcentaje del gasto total representa cada equipo. Con los datos reales la BOTA DE SEGURIDAD representa el 77% del gasto total — eso es una señal crítica para negociación con proveedores o revisión de frecuencia de entrega.

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

const categories = [
  "BOTA DE SEGURIDAD",
  "GUANTES NEGROS",
  "RESPIRADOR",
  "GUANTES BLANCOS",
  "MANDIL",
  "LENTES DE SEGURIDAD",
  "TAPON AUDITIVO",
  "GUANTE VERDE PARA QUIMICOS",
  "CASCO",
  "MANGAS",
  "GUANTE NEOPRENO",
];

const unidades = [208, 186, 86, 177, 29, 58, 100, 8, 3, 12, 6];

const options = {
  chart: {
    type: "pie",
  },
  title: {
    text: "Participación de Costo por Equipo EPP",
  },
  subtitle: {
    text: "Planta 2 — gasto acumulado histórico",
  },
  tooltip: {
    formatter() {
      const index = this.point.index;
      const label = categories[index];
      const und = unidades[index];
      return `<b>${label}</b><br/>
        <span style="color:${this.point.color}">●</span> Gasto total: <b>$${Highcharts.numberFormat(this.point.y, 2, ".", ",")}</b><br/>
        <span style="color:#888">● Participación: <b>${this.point.percentage.toFixed(2)}%</b></span><br/>
        <span style="color:#888">● Unidades entregadas: <b>${und}</b></span>`;
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      innerSize: "50%",
      borderWidth: 2,
      dataLabels: {
        enabled: true,
        formatter() {
          return this.point.percentage >= 2
            ? `<b>${this.point.name}</b><br/>${this.point.percentage.toFixed(1)}%`
            : null;
        },
        style: { fontSize: "11px" },
      },
    },
  },
  series: [
    {
      name: "Gasto total",
      colorByPoint: true,
      data: [
        { name: "BOTA DE SEGURIDAD", y: 112112.0, color: "#2980b9" },
        { name: "GUANTES NEGROS", y: 18135.0, color: "#27ae60" },
        { name: "RESPIRADOR", y: 5160.0, color: "#e67e22" },
        { name: "GUANTES BLANCOS", y: 3982.5, color: "#8e44ad" },
        { name: "MANDIL", y: 3103.0, color: "#e74c3c" },
        { name: "LENTES DE SEGURIDAD", y: 1160.0, color: "#16a085" },
        { name: "TAPON AUDITIVO", y: 500.0, color: "#d35400" },
        { name: "GUANTE VERDE PARA QUIMICOS", y: 400.0, color: "#2c3e50" },
        { name: "CASCO", y: 210.0, color: "#7f8c8d" },
        { name: "MANGAS", y: 198.0, color: "#c0392b" },
        { name: "GUANTE NEOPRENO", y: 18.0, color: "#bdc3c7" },
      ],
    },
  ],
  credits: { enabled: false },
};

const Chart9 = () => {
  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart9;
