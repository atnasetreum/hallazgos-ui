"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { optionsChartDefault } from "@shared/libs";

if (typeof Highcharts === "object") {
  require("highcharts/modules/exporting")(Highcharts);
  require("highcharts/modules/drilldown")(Highcharts);
  require("highcharts/modules/funnel")(Highcharts);
  require("highcharts/modules/export-data")(Highcharts);
  require("highcharts/modules/accessibility")(Highcharts);
}

export const PyramidChart = () => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={{
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
      }}
    />
  );
};
