"use client";

import { useEffect, useMemo, useState } from "react";

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";

import "highcharts/esm/modules/accessibility.src.js";
import "highcharts/esm/themes/adaptive.js";

import { ResponseDashboardStatusByFilters } from "@interfaces";
import { DashboardService } from "@services";
import { optionsChartDefault } from "@shared/libs";

type ChartWithCustomLabel = Highcharts.Chart & {
  customLabel?: Highcharts.SVGElement;
};

interface Props {
  filters: {
    manufacturingPlantId: string;
    startDate: string;
    endDate: string;
    areaId: string;
    areaName: string;
    responsibleId: string;
    responsibleName: string;
  };
}

const statusOrder = ["Abierto", "En progreso", "Cerrado", "Cancelado"];

const StatusChart = ({ filters }: Props) => {
  const [statusData, setStatusData] =
    useState<ResponseDashboardStatusByFilters | null>(null);

  const hasCompleteFilters =
    !!filters.manufacturingPlantId && !!filters.startDate && !!filters.endDate;

  useEffect(() => {
    if (!hasCompleteFilters) {
      setStatusData(null);
      return;
    }

    DashboardService.findStatusByFilters({
      manufacturingPlantId: filters.manufacturingPlantId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      ...(filters.areaId && { areaId: filters.areaId }),
      ...(filters.responsibleId && { responsibleId: filters.responsibleId }),
    }).then(setStatusData);
  }, [
    hasCompleteFilters,
    filters.areaId,
    filters.responsibleId,
    filters.manufacturingPlantId,
    filters.startDate,
    filters.endDate,
  ]);

  const seriesData = useMemo(() => {
    const dataMap = new Map(
      (statusData?.seriesData || []).map((item) => [item.name, item.y]),
    );

    return statusOrder.map((name) => ({
      name,
      y: dataMap.get(name) || 0,
    }));
  }, [statusData]);

  const chartSeriesData = useMemo(
    () => seriesData.filter((item) => item.y > 0),
    [seriesData],
  );

  const total = statusData?.total || 0;

  return (
    <Chart
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={
        {
          ...optionsChartDefault,
          chart: {
            type: "pie",
            events: {
              render() {
                const chart = this as ChartWithCustomLabel;
                const series = chart.series[0];

                if (!series) return;

                let customLabel = chart.customLabel;
                const centerLabelHtml = `<div style="text-align:center; color:#000000;"><span style="display:block;">Total</span><strong style="display:block;">${total.toLocaleString("es-MX")}</strong></div>`;

                if (!customLabel) {
                  customLabel = chart.customLabel = chart.renderer
                    .label(
                      centerLabelHtml,
                      0,
                      0,
                      undefined,
                      undefined,
                      undefined,
                      true,
                    )
                    .css({
                      color: "#000000",
                      textAnchor: "middle",
                    })
                    .attr({
                      zIndex: 7,
                    })
                    .add();
                }

                customLabel.attr({
                  text: centerLabelHtml,
                });

                // Set font size based on chart diameter
                customLabel.css({
                  fontSize: `${series.center[2] / 12}px`,
                });

                const labelBBox = customLabel.getBBox();
                const x =
                  series.center[0] + chart.plotLeft - labelBBox.width / 2;
                const y =
                  series.center[1] + chart.plotTop - labelBBox.height / 2;

                customLabel.attr({
                  x,
                  y,
                });
              },
            },
          },
          accessibility: {
            point: {
              valueSuffix: "%",
            },
          },
          title: {
            text: (() => {
              const titleParts = ["Estatus de hallazgos"];

              if (filters.areaName) {
                titleParts.push(filters.areaName);
              }

              if (filters.responsibleName) {
                titleParts.push(filters.responsibleName);
              }

              return titleParts.join(" - ");
            })(),
          },
          subtitle: {
            text: hasCompleteFilters
              ? `Fecha inicio: <b>${filters.startDate}</b> - Fecha fin: <b>${filters.endDate}</b>`
              : "Seleccione planta, fecha inicio y fecha fin",
          },
          tooltip: {
            pointFormat:
              "{series.name}: <b>{point.y}</b> hallazgos ({point.percentage:.0f}%)",
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            series: {
              allowPointSelect: true,
              cursor: "pointer",
              borderRadius: 8,
              dataLabels: [
                {
                  enabled: true,
                  distance: 20,
                  allowOverlap: true,
                  format: "{point.name}: {point.percentage:.0f}% ({point.y})",
                  style: {
                    fontSize: "0.9em",
                  },
                },
              ],
              showInLegend: true,
            },
          },
          series: [
            {
              name: "Estatus",
              colorByPoint: true,
              innerSize: "75%",
              data: chartSeriesData,
            },
          ],
        } as Highcharts.Options
      }
    />
  );
};

export default StatusChart;
