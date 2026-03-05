"use client";

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";
import "highcharts/esm/modules/funnel.src.js";
import "highcharts/esm/modules/export-data.src.js";
import "highcharts/esm/modules/accessibility.src.js";

import { optionsChartDefault } from "@shared/libs";

export const PyramidChart = () => {
  return (
    <Chart
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={
        {
          ...optionsChartDefault,
          chart: {
            type: "pyramid",
          },
          title: {
            text: "Pirámide de seguridad",
            x: -50,
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: "<b>{point.name}</b> ({point.y:,.0f})",
                softConnector: true,
              },
              center: ["40%", "50%"],
              width: "80%",
            },
          },
          legend: {
            enabled: false,
          },
          series: [
            {
              name: "Valor",
              data: [
                ["Desviaciones - Comportamientos y condiciones", 56],
                ["Incidentes (casi accidentes)", 0],
                ["Accidentes sin ausentismo", 0],
                ["Accidentes con ausentismo", 0],
                ["Fatalidad o accidentes graves", 0],
              ],
            },
          ],
        } as Highcharts.Options
      }
    />
  );
};
