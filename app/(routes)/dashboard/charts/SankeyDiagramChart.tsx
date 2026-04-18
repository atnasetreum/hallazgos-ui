"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

import Highcharts from "highcharts/esm/highcharts.src.js";
import { Chart } from "@highcharts/react";

import "highcharts/esm/modules/accessibility.src.js";
import "highcharts/esm/modules/sankey.src.js";

import { ResponseDashboardSankeyByFilters } from "@interfaces";
import { DashboardService } from "@services";
import { optionsChartDefault } from "@shared/libs";

interface Props {
  filters: {
    manufacturingPlantId: string;
    manufacturingPlantName: string;
    startDate: string;
    endDate: string;
    areaId: string;
    areaName: string;
    responsibleId: string;
    responsibleName: string;
  };
}

const SankeyDiagramChart = ({ filters }: Props) => {
  const theme = useTheme();
  const [sankeyData, setSankeyData] =
    useState<ResponseDashboardSankeyByFilters | null>(null);

  const hasCompleteFilters =
    !!filters.manufacturingPlantId && !!filters.startDate && !!filters.endDate;

  useEffect(() => {
    if (!hasCompleteFilters) {
      setSankeyData(null);
      return;
    }

    DashboardService.findSankeyByFilters({
      manufacturingPlantId: filters.manufacturingPlantId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      ...(filters.areaId && { areaId: filters.areaId }),
      ...(filters.responsibleId && { responsibleId: filters.responsibleId }),
    }).then(setSankeyData);
  }, [
    hasCompleteFilters,
    filters.manufacturingPlantId,
    filters.startDate,
    filters.endDate,
    filters.areaId,
    filters.responsibleId,
  ]);

  const isDarkMode = theme.palette.mode === "dark";
  const chartTextColor = isDarkMode ? "#f1f5f9" : "#111827";
  const chartSubtleTextColor = isDarkMode ? "#cbd5e1" : "#374151";
  const chartBorderColor = isDarkMode ? "#334155" : "#d1d5db";

  const sankeyLinks = useMemo(
    () =>
      (sankeyData?.links || []).map((item) => [
        item.from,
        item.to,
        item.weight,
      ]),
    [sankeyData],
  );

  return (
    <Chart
      highcharts={Highcharts}
      containerProps={{ style: { height: "100%" } }}
      options={
        {
          ...optionsChartDefault,
          chart: {
            type: "sankey",
            height: 520,
            backgroundColor: "transparent",
            plotBackgroundColor: "transparent",
          },
          title: {
            text: (() => {
              const titleParts = ["Flujo de hallazgos Zona -> Estatus"];

              if (filters.areaName) {
                titleParts.push(filters.areaName);
              }

              if (filters.responsibleName) {
                titleParts.push(filters.responsibleName);
              }

              return titleParts.join(" - ");
            })(),
            style: {
              color: chartTextColor,
            },
          },
          subtitle: {
            text: hasCompleteFilters
              ? `Planta: <b>${filters.manufacturingPlantName || "-"}</b> - Fecha inicio: <b>${filters.startDate}</b> - Fecha fin: <b>${filters.endDate}</b>${sankeyLinks.length === 0 ? " - Sin datos para los filtros seleccionados" : ""}`
              : "Seleccione planta, fecha inicio y fecha fin",
            style: {
              color: chartSubtleTextColor,
            },
          },
          tooltip: {
            pointFormat:
              "<b>{point.fromNode.name}</b> -> <b>{point.toNode.name}</b>: <b>{point.weight}</b> hallazgos",
            backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
            borderColor: chartBorderColor,
            style: {
              color: chartTextColor,
            },
          },
          plotOptions: {
            sankey: {
              nodeWidth: 24,
              nodePadding: 18,
              dataLabels: {
                enabled: true,
                style: {
                  color: chartTextColor,
                  textOutline: "none",
                },
              },
              states: {
                inactive: {
                  opacity: 0.35,
                },
              },
            },
            series: {
              animation: {
                duration: 700,
              },
            },
          },
          accessibility: {
            point: {
              valueDescriptionFormat:
                "{index}. Desde {point.from} hacia {point.to}, {point.weight} hallazgos.",
            },
          },
          legend: {
            enabled: false,
          },
          series: [
            {
              type: "sankey",
              name: "Flujo",
              keys: ["from", "to", "weight"],
              data: sankeyLinks,
              nodes: sankeyData?.nodes || [],
            },
          ],
        } as Highcharts.Options
      }
    />
  );
};

export default SankeyDiagramChart;
