"use client";

import { useState } from "react";

import { Box, Stack, Tab, Tabs } from "@mui/material";
import { alpha } from "@mui/material/styles";

import RecentEvidencesGeneral from "./RecentEvidencesGeneral";
import OpenEvidencesGeneral from "./OpenEvidencesGeneral";
import MyEvidencesGeneral from "./MyEvidencesGeneral";
import { User } from "@interfaces";

interface Props {
  user: User;
  manufacturingPlantId: string;
}

export const DashboardGeneral = ({ user, manufacturingPlantId }: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Stack direction="column" spacing={4}>
      <MyEvidencesGeneral user={user} />

      <Stack spacing={2}>
        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          scrollButtons="auto"
          aria-label="tabs de tablas dashboard general"
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
            id="dashboard-general-table-tab-0"
            aria-controls="dashboard-general-table-panel-0"
          />
          <Tab
            label="Evidencias abiertas"
            id="dashboard-general-table-tab-1"
            aria-controls="dashboard-general-table-panel-1"
          />
        </Tabs>

        <Box
          role="tabpanel"
          sx={{
            display: activeTab === 0 ? "block" : "none",
          }}
          id="dashboard-general-table-panel-0"
          aria-labelledby="dashboard-general-table-tab-0"
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
          id="dashboard-general-table-panel-1"
          aria-labelledby="dashboard-general-table-tab-1"
        >
          <OpenEvidencesGeneral
            user={user}
            manufacturingPlantId={manufacturingPlantId}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default DashboardGeneral;
