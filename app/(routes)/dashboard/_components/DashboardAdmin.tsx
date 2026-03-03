"use client";

import { useState } from "react";

import { Box, Grid, Stack, Tab, Tabs } from "@mui/material";

import RankingOfResponsiblesAdmin from "./RankingOfResponsiblesAdmin";
import AverageResolutionAdmin from "./AverageResolutionAdmin";
import CriticalZonesAdmin from "./CriticalZonesAdmin";
import GlobalSummaryAdmin from "./GlobalSummaryAdmin";
//import SubtypeTrendAdmin from "./SubtypeTrendAdmin";
import GlobalTrendAdmin from "./GlobalTrendAdmin";
import TypeTrendAdmin from "./TypeTrendAdmin";

interface Props {
  manufacturingPlantId: string;
}

export const DashboardAdmin = ({ manufacturingPlantId }: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Stack spacing={2.5}>
      <GlobalSummaryAdmin manufacturingPlantId={manufacturingPlantId} />
      <AverageResolutionAdmin manufacturingPlantId={manufacturingPlantId} />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <TypeTrendAdmin manufacturingPlantId={manufacturingPlantId} />
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <GlobalTrendAdmin manufacturingPlantId={manufacturingPlantId} />
        </Grid>
      </Grid>

      {/* <SubtypeTrendAdmin manufacturingPlantId={manufacturingPlantId} /> */}
      <Stack spacing={2}>
        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          scrollButtons="auto"
          aria-label="full width tabs example"
          sx={{ backgroundColor: "primary.main" }}
        >
          <Tab
            label="Ranking de responsables"
            id="dashboard-table-tab-0"
            aria-controls="dashboard-table-panel-0"
          />
          <Tab
            label="Zonas críticas"
            id="dashboard-table-tab-1"
            aria-controls="dashboard-table-panel-1"
          />
        </Tabs>

        <Box
          role="tabpanel"
          sx={{
            display: activeTab === 0 ? "block" : "none",
          }}
          id="dashboard-table-panel-0"
          aria-labelledby="dashboard-table-tab-0"
        >
          <RankingOfResponsiblesAdmin
            manufacturingPlantId={manufacturingPlantId}
          />
        </Box>

        <Box
          role="tabpanel"
          sx={{
            display: activeTab === 1 ? "block" : "none",
          }}
          id="dashboard-table-panel-1"
          aria-labelledby="dashboard-table-tab-1"
        >
          <CriticalZonesAdmin manufacturingPlantId={manufacturingPlantId} />
        </Box>
      </Stack>
    </Stack>
  );
};

export default DashboardAdmin;
