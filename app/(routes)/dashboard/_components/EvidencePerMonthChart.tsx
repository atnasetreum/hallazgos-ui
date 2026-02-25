"use client";

import { useEffect, useState } from "react";

import Highcharts from "highcharts/highcharts.src";
import { Chart } from "@highcharts/react";
import "highcharts/esm/modules/exporting";
import "highcharts/esm/modules/drilldown";
import regression from "regression";

import { ResponseDashboardEvidencesByMonth } from "@interfaces";
import { optionsChartDefault } from "@shared/libs";
import useCustomTheme from "_hooks/useCustomTheme";
import { DashboardService } from "@services";

interface Props {
  year?: number;
  projections?: boolean;
}

export const EvidencePerMonthChart = ({ year, projections = false }: Props) => {
  const [data, setData] = useState({} as ResponseDashboardEvidencesByMonth);
  const [monthsToPredictSize, setMonthsToPredictSize] = useState<number>(0);

  const { colorText } = useCustomTheme();

  useEffect(() => {
    DashboardService.findAllEvidencesByMonth(year).then((response) => {
      let dataChart = response;

      if (projections) {
        const months: {
          [key: string]: number;
        } = {
          Ene: 1,
          Feb: 2,
          Mar: 3,
          Abr: 4,
          May: 5,
          Jun: 6,
          Jul: 7,
          Ago: 8,
          Sep: 9,
          Oct: 10,
          Nov: 11,
          Dic: 12,
        };

        const monthsToPredict = Object.keys(months).filter(
          (month) => !response.categories.includes(month),
        );

        setMonthsToPredictSize(monthsToPredict.length);

        const regressionData = response.series.map((serie) => {
          const resultado = regression.linear(
            serie.data.map((dataPoint, index) => [index + 1, dataPoint]),
          );
          const proyecciones = monthsToPredict
            .map((mes) => months[mes])
            .map((mes) =>
              Math.round(resultado.predict(mes)[1]) < 0
                ? 0
                : Math.round(resultado.predict(mes)[1]),
            );

          return {
            name: serie.name,
            data: proyecciones,
          };
        });

        dataChart = {
          categories: monthsToPredict,
          series: regressionData,
        };
      }

      setData(dataChart);
    });
  }, [year, projections]);

  if (!Object.keys(data).length) return null;

  return (
    <Chart
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={
        {
          ...{
            ...optionsChartDefault,
            ...(year && {
              subtitle: {
                text: ``,
              },
            }),
          },
          chart: {
            type: "line",
          },
          title: {
            text: !monthsToPredictSize
              ? `Hallazgos ${year || new Date().getFullYear()}, por mes`
              : `Proyección proximos ${monthsToPredictSize} meses`,
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
            title: {
              text: "Total de hallazgos",
              style: {
                color: colorText,
              },
            },
          },
          legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            itemStyle: {
              color: colorText,
            },
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
        } as Highcharts.Options
      }
    />
  );
};
