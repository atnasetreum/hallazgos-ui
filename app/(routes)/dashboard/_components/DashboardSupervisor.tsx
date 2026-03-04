"use client";

import { useState } from "react";

import { Box, Grid, Stack, Tab, Tabs } from "@mui/material";
import { alpha } from "@mui/material/styles";

import AverageTimeByUserAssigned from "./AverageTimeByUserAssigned";
import RecentEvidencesGeneral from "./RecentEvidencesGeneral";
import TypeOfEvidencesByUser from "./TypeOfEvidencesByUser";
import OpenEvidencesGeneral from "./OpenEvidencesGeneral";
import MyEvidencesGeneral from "./MyEvidencesGeneral";
import AverageTimeByUser from "./AverageTimeByUser";
import GlobalTrendAdmin from "./GlobalTrendAdmin";
import { User } from "@interfaces";
import PendingBySeniorityByUser from "./PendingBySeniorityByUser";

interface Props {
  user: User;
  manufacturingPlantId: string;
}

export const DashboardSupervisor = ({ user, manufacturingPlantId }: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Stack direction="column" spacing={4}>
      <MyEvidencesGeneral user={user} />
      <AverageTimeByUser
        user={user}
        manufacturingPlantId={manufacturingPlantId}
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, xl: 6 }}>
          <TypeOfEvidencesByUser
            manufacturingPlantId={manufacturingPlantId}
            user={user}
          />
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <GlobalTrendAdmin
            manufacturingPlantId={manufacturingPlantId}
            user={user}
          />
        </Grid>
      </Grid>

      <AverageTimeByUserAssigned
        user={user}
        manufacturingPlantId={manufacturingPlantId}
      />

      <Stack spacing={2}>
        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          scrollButtons="auto"
          aria-label="tabs de tablas dashboard supervisor"
          sx={{
            backgroundColor: "primary.main",
            "& .MuiTab-root": {
              color: (theme) => alpha(theme.palette.common.white, 0.68),
              opacity: 1,
              transition: "all 0.2s ease",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "common.white",
              fontWeight: 700,
              backgroundColor: (theme) =>
                alpha(theme.palette.common.white, 0.14),
            },
          }}
        >
          <Tab
            label="Evidencias recientes"
            id="dashboard-supervisor-table-tab-0"
            aria-controls="dashboard-supervisor-table-panel-0"
          />
          <Tab
            label="Evidencias abiertas"
            id="dashboard-supervisor-table-tab-1"
            aria-controls="dashboard-supervisor-table-panel-1"
          />
          <Tab
            label="Pendientes por antigüedad"
            id="dashboard-supervisor-table-tab-2"
            aria-controls="dashboard-supervisor-table-panel-2"
          />
        </Tabs>

        <Box
          role="tabpanel"
          sx={{
            display: activeTab === 0 ? "block" : "none",
          }}
          id="dashboard-supervisor-table-panel-0"
          aria-labelledby="dashboard-supervisor-table-tab-0"
        >
          <RecentEvidencesGeneral
            user={user}
            manufacturingPlantId={manufacturingPlantId}
          />
        </Box>

        <Box
          role="tabpanel"
          sx={{
            display: activeTab === 1 ? "block" : "none",
          }}
          id="dashboard-supervisor-table-panel-1"
          aria-labelledby="dashboard-supervisor-table-tab-1"
        >
          <OpenEvidencesGeneral
            user={user}
            manufacturingPlantId={manufacturingPlantId}
          />
        </Box>

        <Box
          role="tabpanel"
          sx={{
            display: activeTab === 2 ? "block" : "none",
          }}
          id="dashboard-supervisor-table-panel-2"
          aria-labelledby="dashboard-supervisor-table-tab-2"
        >
          <PendingBySeniorityByUser
            user={user}
            manufacturingPlantId={manufacturingPlantId}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default DashboardSupervisor;
