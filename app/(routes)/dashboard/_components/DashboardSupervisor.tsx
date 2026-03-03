import { Stack } from "@mui/material";

import RecentEvidencesGeneral from "./RecentEvidencesGeneral";
import OpenEvidencesGeneral from "./OpenEvidencesGeneral";
import MyEvidencesGeneral from "./MyEvidencesGeneral";
import { User } from "@interfaces";

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
    </Stack>
  );
};

export default DashboardSupervisor;
