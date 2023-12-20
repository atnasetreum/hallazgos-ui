"use client";

import { useEffect, useState } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/drilldown")(Highcharts);

import { DashboardService } from "@services";
import { DashboardStatus } from "@interfaces";

const PieChartDafault = () => {
  const [data, setData] = useState<DashboardStatus | null>(null);

  const getData = () => {
    DashboardService.findAllStatus().then(setData);
    DashboardService.findRelevantData().then((data) => {
      console.log(data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  if (!data) return null;

  return (
    <HighchartsReact
      containerProps={{ style: { height: "100%" } }}
      highcharts={Highcharts}
      options={{
        chart: {
          type: "pie",
        },
        title: {
          text: "Status",
          align: "left",
        },
        subtitle: {
          text: "Porcentaje de hallazgos por estatus",
          align: "left",
        },
        credits: { enabled: false },
        accessibility: {
          enabled: false,
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

        series: data.series,
        drilldown: data.drilldown,
      }}
    />
  );
};

export default PieChartDafault;
