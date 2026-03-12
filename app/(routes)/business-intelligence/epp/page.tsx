"use client";

import { useState } from "react";

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

const chartGroups = [
  {
    title: "Gasto y Costo",
    charts: [Chart2, Chart1],
  },
  {
    title: "Entregas y Operacion",
    charts: [Chart4, Chart3],
  },
  {
    title: "Cobertura de Empleados",
    charts: [Chart7, Chart6, Chart5],
  },
  {
    title: "Analisis de Costos",
    charts: [Chart10, Chart9, Chart8],
  },
];

const EPPCharts = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeGroup = chartGroups[activeTab];

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
          {activeGroup.charts.map((ChartComponent, index) => (
            <Grid
              key={`${activeGroup.title}-${index}`}
              size={{ xs: 12, md: 6 }}
            >
              <Box sx={{ width: "100%" }}>
                <ChartComponent />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default EPPCharts;
