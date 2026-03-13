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

const Chart9 = ({ data }: Props) => {
  const rows = data?.chart9 ?? [];

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Participacion de Costo por Equipo EPP",
    },
    subtitle: {
      text: "Gasto acumulado historico",
    },
    tooltip: {
      pointFormat:
        '<span style="color:{point.color}">●</span> Gasto total: <b>${point.y:,.2f}</b><br/><span style="color:#888">● Participacion: <b>{point.percentage:.2f}%</b></span><br/><span style="color:#888">● Unidades entregadas: <b>{point.custom.units}</b></span>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        innerSize: "50%",
        borderWidth: 2,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br/>{point.percentage:.1f}%",
          style: { fontSize: "11px" },
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Gasto total",
        data: rows.map((row) => ({
          name: row.equipment_name,
          y: toNumber(row.gasto_total),
          custom: {
            units: toNumber(row.unidades_total),
            pctDelTotal: toNumber(row.pct_del_total),
          },
        })),
      },
    ],
    credits: { enabled: false },
  };

  return <Chart highcharts={Highcharts} options={options} />;
};

export default Chart9;
