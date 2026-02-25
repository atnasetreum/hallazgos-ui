"use client";

import { useEffect, useState } from "react";

import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting";
import "highcharts/esm/modules/drilldown";
import Highcharts from "highcharts/highcharts.src";

import { ResponseOpenVsClosed } from "@interfaces";
import { optionsChartDefault } from "@shared/libs";
import useCustomTheme from "_hooks/useCustomTheme";
import { DashboardService } from "@services";

export const ProductivityChart = () => {
  const [data, setData] = useState({} as ResponseOpenVsClosed);

  const { colorText } = useCustomTheme();

  useEffect(() => {
    DashboardService.findOpendVsClosed().then(setData);
  }, []);

  if (!Object.keys(data).length) return null;

  return (
    <Chart
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={
        {
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
        } as Highcharts.Options
      }
    />
  );
};
