"use client";

import { useEffect, useState } from "react";

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting.src.js";
import "highcharts/esm/modules/drilldown.src.js";

import { optionsChartDefault } from "@shared/libs";
import { DashboardService } from "@services";
import { ResponseDashboardMainTypes } from "@interfaces";

export const MainTypesChart = () => {
  const [data, setData] = useState({} as ResponseDashboardMainTypes);

  useEffect(() => {
    DashboardService.findAllMainTypes().then(setData);
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
            type: "column",
          },
          title: {
            text: "Critertios de hallazgos, en planta",
          },
          accessibility: {
            announceNewData: {
              enabled: true,
            },
          },
          xAxis: {
            type: "category",
          },
          yAxis: {
            title: {
              text: "Porcentaje total",
            },
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: "{point.y:.1f}%",
              },
            },
          },

          tooltip: {
            headerFormat:
              '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat:
              '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
          },

          series: data.series,
          drilldown: data.drilldown as Highcharts.DrilldownOptions,
        } as Highcharts.Options
      }
    />
  );
};
