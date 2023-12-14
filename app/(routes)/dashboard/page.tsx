"use client";

import { useCallback, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { MainTypesService, ZonesService } from "@services";
import { useCategoriesStore } from "@store";

export default function DashboardPage() {
  const { setCategories } = useCategoriesStore();

  const initialCategories = useCallback(async () => {
    const [mainTypes, zones] = await Promise.all([
      MainTypesService.findAll(),
      ZonesService.findAll(),
    ]);

    setCategories({
      mainTypes,
      zones,
    });
  }, [setCategories]);

  useEffect(() => {
    initialCategories();
  }, [initialCategories]);

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
