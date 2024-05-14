"use client";

import { useEffect, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { optionsChartDefault } from "@shared/libs";
import { DashboardService } from "@services";
import { ResponseDashboardMultiNivel } from "@interfaces";

if (typeof Highcharts === "object") {
  require("highcharts/modules/exporting")(Highcharts);
  require("highcharts/modules/drilldown")(Highcharts);
}

export const ZonesChart = () => {
  const [data, setData] = useState({} as ResponseDashboardMultiNivel);

  useEffect(() => {
    DashboardService.findAllZones().then(setData);
  }, []);

  if (!Object.keys(data).length) return null;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={{
        ...optionsChartDefault,
        chart: {
          type: "pie",
        },
        title: {
          text: "Hallazgos por zonas, en planta",
        },
        accessibility: {
          announceNewData: {
            enabled: true,
          },
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          series: {
            borderRadius: 5,
            dataLabels: [
              {
                enabled: true,
                distance: 15,
                format: "{point.name}",
              },
              {
                enabled: true,
                distance: "-30%",
                filter: {
                  property: "percentage",
                  operator: ">",
                  value: 5,
                },
                format: "{point.y:.1f}%",
                style: {
                  fontSize: "0.9em",
                  textOutline: "none",
                },
              },
            ],
          },
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
        },
        series: [
          {
            name: "Estatus",
            colorByPoint: true,
            data: data.statusData,
          },
        ],
        drilldown: {
          series: data.statusSeries,
        },
      }}
    />
  );
};
