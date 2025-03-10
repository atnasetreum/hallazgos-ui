"use client";

import { useEffect, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { ResponseDashboardEvidencesByMonth } from "@interfaces";
import { optionsChartDefault } from "@shared/libs";
import { DashboardService } from "@services";

if (typeof Highcharts === "object") {
  require("highcharts/modules/exporting")(Highcharts);
  require("highcharts/modules/drilldown")(Highcharts);
}

interface Props {
  year?: number;
}

export const EvidencePerMonthChart = ({ year }: Props) => {
  const [data, setData] = useState({} as ResponseDashboardEvidencesByMonth);

  useEffect(() => {
    DashboardService.findAllEvidencesByMonth(year).then(setData);
  }, [year]);

  if (!Object.keys(data).length) return null;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={{
        ...optionsChartDefault,
        chart: {
          type: "line",
        },
        title: {
          text: `Hallazgos por mes, ${year || new Date().getFullYear()}`,
        },
        xAxis: {
          categories: data.categories,
        },
        yAxis: {
          title: {
            text: "Total de hallazgos",
          },
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true,
            },
            enableMouseTracking: false,
          },
        },
        series: data.series,
      }}
    />
  );
};
