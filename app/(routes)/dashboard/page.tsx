import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import { StatusChart } from "./_components/StatusChart";
import { ZonesChart } from "./_components/ZonesChart";
//import { PyramidChart } from "./_components/PyramidChart";

export default function DashboardPage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4} lg={3}>
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
      <Grid item xs={12} md={4} lg={3}>
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
    </Grid>
  );
}
