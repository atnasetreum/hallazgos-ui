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

const PieChartDafault3 = () => {
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
        chart: {
          type: "bar",
        },
        title: {
          text: "Historic World Population by Region",
          align: "left",
        },
        subtitle: {
          text:
            "Source: <a " +
            'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
            'target="_blank">Wikipedia.org</a>',
          align: "left",
        },
        xAxis: {
          categories: ["Africa", "America", "Asia", "Europe"],
          title: {
            text: null,
          },
          gridLineWidth: 1,
          lineWidth: 0,
        },
        yAxis: {
          min: 0,
          title: {
            text: "Population (millions)",
            align: "high",
          },
          labels: {
            overflow: "justify",
          },
          gridLineWidth: 0,
        },
        tooltip: {
          valueSuffix: " millions",
        },
        plotOptions: {
          bar: {
            borderRadius: "50%",
            dataLabels: {
              enabled: true,
            },
            groupPadding: 0.1,
          },
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "top",
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,

          shadow: true,
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: "Year 1990",
            data: [631, 727, 3202, 721],
          },
          {
            name: "Year 2000",
            data: [814, 841, 3714, 726],
          },
          {
            name: "Year 2018",
            data: [1276, 1007, 4561, 746],
          },
        ],
      }}
    />
  );
};

export default PieChartDafault3;
