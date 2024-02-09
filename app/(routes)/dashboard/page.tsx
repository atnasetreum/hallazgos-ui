import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import PieChartDafault from "./_components/PieChartDafault";
import PieChartDafault2 from "./_components/PieChartDafault2";
import PieChartDafault3 from "./_components/PieChartDafault3";

export default function DashboardPage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 350,
          }}
        >
          <PieChartDafault />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 350,
          }}
        >
          <PieChartDafault2 />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <PieChartDafault3 />
        </Paper>
      </Grid>
    </Grid>
  );
}
