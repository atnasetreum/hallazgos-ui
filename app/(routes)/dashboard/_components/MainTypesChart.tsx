"use client";

import { useEffect, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { optionsChartDefault } from "@shared/libs";
import { DashboardService } from "@services";
import { ResponseDashboardMainTypes } from "@interfaces";

if (typeof Highcharts === "object") {
  require("highcharts/modules/exporting")(Highcharts);
  require("highcharts/modules/drilldown")(Highcharts);
}

export const MainTypesChart = () => {
  const [data, setData] = useState({} as ResponseDashboardMainTypes);

  useEffect(() => {
    DashboardService.findAllMainTypes().then(setData);
  }, []);

  if (!Object.keys(data).length) return null;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={{
        ...optionsChartDefault,
        chart: {
          type: "column",
        },
        title: {
          align: "left",
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
            text: "Total percent market share",
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
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
        },

        series: data.series,
        drilldown: data.drilldown,
      }}
    />
  );
};
