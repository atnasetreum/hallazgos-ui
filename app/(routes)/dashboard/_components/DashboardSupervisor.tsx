import { Grid, Stack } from "@mui/material";

import RecentEvidencesGeneral from "./RecentEvidencesGeneral";
import OpenEvidencesGeneral from "./OpenEvidencesGeneral";
import MyEvidencesGeneral from "./MyEvidencesGeneral";
import { User } from "@interfaces";
import GlobalTrendAdmin from "./GlobalTrendAdmin";

interface Props {
  user: User;
  manufacturingPlantId: string;
}

export const DashboardSupervisor = ({ user, manufacturingPlantId }: Props) => {
  return (
    <Stack direction="column" spacing={4}>
      <MyEvidencesGeneral user={user} />
      <RecentEvidencesGeneral
        user={user}
        manufacturingPlantId={manufacturingPlantId}
      />
      <OpenEvidencesGeneral
        user={user}
        manufacturingPlantId={manufacturingPlantId}
      />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, xl: 6 }}>
          {/* <TypeTrendAdmin manufacturingPlantId={manufacturingPlantId} /> */}
        </Grid>
        <Grid size={{ xs: 12, xl: 6 }}>
          <GlobalTrendAdmin
            manufacturingPlantId={manufacturingPlantId}
            user={user}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardSupervisor;
