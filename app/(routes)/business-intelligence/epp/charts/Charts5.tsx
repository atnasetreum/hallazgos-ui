"use client";

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

import type { BusinessIntelligenceEpp } from "@interfaces";

type Props = {
  data: BusinessIntelligenceEpp | null;
};

const toNumber = (value: string | number | null | undefined) =>
  Number(value ?? 0);

const Chart5 = ({ data }: Props) => {
  const row = data?.chart5?.[0];

  const totalActivos = toNumber(row?.total_empleados_activos);
  const conActual = toNumber(row?.con_entrega_mes_actual);
  const sinActual = toNumber(row?.sin_entrega_mes_actual);
  const conAnterior = toNumber(row?.con_entrega_mes_anterior);
  const sinAnterior = toNumber(row?.sin_entrega_mes_anterior);

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Cobertura de Entregas EPP",
      style: { fontSize: "16px" },
    },
    subtitle: {
      text: `${totalActivos} empleados activos`,
    },
    plotOptions: {
      pie: {
        shadow: false,
        borderWidth: 2,
      },
    },
    tooltip: {
      useHTML: true,
      headerFormat:
        '<span style="font-size:11px"><b>{series.name}</b></span><br/>',
      pointFormat:
        '<span style="color:{point.color}">●</span> {point.name}: <b>{point.y} empleados</b><br/><span style="color:#888">{point.percentage:.2f}% del total</span>',
    },
    series: [
      {
        type: "pie",
        name: "Mes Anterior",
        size: "60%",
        innerSize: "30%",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br/>{point.percentage:.1f}%",
          distance: -40,
          style: { fontSize: "11px", color: "#fff", textOutline: "none" },
        },
        data: [
          { name: "Con entrega", y: conAnterior, color: "#27ae60" },
          { name: "Sin entrega", y: sinAnterior, color: "#e74c3c" },
        ],
      },
      {
        type: "pie",
        name: "Mes Actual",
        size: "100%",
        innerSize: "65%",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br/>{point.percentage:.1f}%",
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

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart5;
