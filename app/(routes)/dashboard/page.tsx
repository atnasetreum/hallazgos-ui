"use client";

import { useEffect } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { UsersService } from "@services";

export default function DashboardPage() {
  useEffect(() => {
    UsersService.findAll().then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          Chart 1
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          Chart 2
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          Chart 3
        </Paper>
      </Grid>
    </Grid>
  );
}
