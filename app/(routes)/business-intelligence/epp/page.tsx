"use client";

import { useEffect, useState, type ComponentType } from "react";

import { Box, Grid, Stack, Tab, Tabs } from "@mui/material";
import { alpha } from "@mui/material/styles";

import Chart1 from "./charts/Charts1";
import Chart2 from "./charts/Charts2";
import Chart3 from "./charts/Charts3";
import Chart4 from "./charts/Charts4";
import Chart5 from "./charts/Charts5";
import Chart6 from "./charts/Charts6";
import Chart7 from "./charts/Charts7";
import Chart8 from "./charts/Charts8";
import Chart9 from "./charts/Charts9";
import Chart10 from "./charts/Charts10";
import { DashboardService } from "@services";
import { BusinessIntelligenceEpp } from "@interfaces";

type ChartComponentProps = {
  data: BusinessIntelligenceEpp | null;
};

type ChartComponentType = ComponentType<ChartComponentProps>;
type ChartGroupItem = {
  Component: ChartComponentType;
  fullWidth?: boolean;
};

const chartGroups = [
  {
    title: "Gasto y Costo",
    charts: [{ Component: Chart2 }, { Component: Chart1 }] as ChartGroupItem[],
  },
  {
    title: "Entregas y Operacion",
    charts: [{ Component: Chart4 }, { Component: Chart3 }] as ChartGroupItem[],
  },
  {
    title: "Cobertura de Empleados",
    charts: [
      { Component: Chart7 },
      { Component: Chart6 },
      { Component: Chart5, fullWidth: true },
    ] as ChartGroupItem[],
  },
  {
    title: "Analisis de Costos",
    charts: [
      { Component: Chart10 },
      { Component: Chart9 },
      { Component: Chart8, fullWidth: true },
    ] as ChartGroupItem[],
  },
];

const EPPCharts = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeGroup = chartGroups[activeTab];
  const [data, setData] = useState<BusinessIntelligenceEpp | null>(null);

  useEffect(() => {
    DashboardService.findBusinessIntelligenceEpp({
      manufacturingPlantId: "2",
    }).then(setData);
  }, []);

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue: number) => setActiveTab(newValue)}
        aria-label="Grupos de indicadores EPP"
        sx={{
          width: "100%",
          backgroundColor: "primary.main",
          "& .MuiTab-root": {
            color: (theme) => alpha(theme.palette.common.white, 0.68),
            opacity: 1,
            transition: "all 0.2s ease",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "common.white",
            fontWeight: 700,
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.14),
          },
        }}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        scrollButtons="auto"
      >
        {chartGroups.map((group, index) => (
          <Tab
            key={group.title}
            label={group.title}
            id={`epp-group-tab-${index}`}
            aria-controls={`epp-group-panel-${index}`}
          />
        ))}
      </Tabs>

      <Stack
        spacing={2}
        role="tabpanel"
        id={`epp-group-panel-${activeTab}`}
        aria-labelledby={`epp-group-tab-${activeTab}`}
      >
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {activeGroup.charts.map(({ Component, fullWidth }, index) => (
            <Grid
              key={`${activeGroup.title}-${index}`}
              size={{
                xs: 12,
                md: fullWidth ? 12 : 6,
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Component data={data} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default EPPCharts;
