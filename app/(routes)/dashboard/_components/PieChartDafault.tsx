/*"use client";

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
*/

"use client";

import { useEffect } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { DashboardService } from "@services";

const PieChartDafault = () => {
  const getData = () => {
    DashboardService.findAllStatus().then((data) => {
      console.log({ status: data });
    });
    /*DashboardService.findRelevantData().then((data) => {
      console.log(data);
    });*/
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={{
        title: {
          text: "U.S Solar Employment Growth",
          align: "left",
        },

        subtitle: {
          text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
          align: "left",
        },

        yAxis: {
          title: {
            text: "Number of Employees",
          },
        },

        xAxis: {
          accessibility: {
            rangeDescription: "Range: 2010 to 2020",
          },
        },

        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
            pointStart: 2010,
          },
        },

        series: [
          {
            name: "Installation & Developers",
            data: [
              43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174,
              155157, 161454, 154610,
            ],
          },
          {
            name: "Manufacturing",
            data: [
              24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726,
              34243, 31050,
            ],
          },
          {
            name: "Sales & Distribution",
            data: [
              11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243,
              29213, 25663,
            ],
          },
          {
            name: "Operations & Maintenance",
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              11164,
              11218,
              10077,
            ],
          },
          {
            name: "Other",
            data: [
              21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906,
              10073,
            ],
          },
        ],

        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      }}
    />
  );
};

export default PieChartDafault;
