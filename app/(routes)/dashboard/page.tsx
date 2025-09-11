"use client";

import { SyntheticEvent, useState } from "react";

import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import {
  //AccidentRateIndicator,
  EvidencePerMonthChart,
  //HeatMapChart,
  MainTypesChart,
  ProductivityChart,
  StatusChart,
  TopUsersByPlantChart,
  ZonesChart,
} from "./_components";
import {
  a11yProps,
  TabPanel,
} from "@routes/hallazgos/_components/TabsImageAndLogs";

export default function DashboardPage() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Estatus / Criterios / Zonas" {...a11yProps(0)} />
          <Tab label="Meses" {...a11yProps(1)} />
          <Tab label="Epp" {...a11yProps(2)} />
          <Tab label="Usuarios" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <StatusChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MainTypesChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ZonesChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ProductivityChart />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <EvidencePerMonthChart projections={true} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <EvidencePerMonthChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <EvidencePerMonthChart year={2024} />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          ...
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TopUsersByPlantChart />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
