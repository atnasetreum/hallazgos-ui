"use client";

import { useEffect, useState } from "react";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import { ResponseOpenVsClosed } from "@interfaces";
import { optionsChartDefault } from "@shared/libs";
import useCustomTheme from "_hooks/useCustomTheme";
import { DashboardService } from "@services";

if (typeof Highcharts === "object") {
  require("highcharts/modules/exporting")(Highcharts);
  require("highcharts/modules/drilldown")(Highcharts);
}

export const ProductivityChart = () => {
  const [data, setData] = useState({} as ResponseOpenVsClosed);

  const { colorText } = useCustomTheme();

  useEffect(() => {
    DashboardService.findOpendVsClosed().then(setData);
  }, []);

  if (!Object.keys(data).length) return null;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={{
        ...optionsChartDefault,
        chart: {
          type: "bar",
        },
        title: {
          text: "Comparativo entre hallazgos abiertos y cerrados",
          align: "center",
        },
        xAxis: {
          categories: data.categories,
          labels: {
            style: {
              color: colorText,
            },
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "",
          },
        },
        legend: {
          reversed: true,
        },
        plotOptions: {
          series: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: data.series,
      }}
    />
  );
};
