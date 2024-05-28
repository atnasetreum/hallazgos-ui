import { ReactElement, Ref, forwardRef, useState } from "react";

import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { EvidenceGraphql } from "@hooks";
import DetailsEvidence from "./DetailsEvidence";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  evidenceCurrent: EvidenceGraphql | null;
  handleClose: (refreshData: boolean) => void;
}

export default function EvidencePreview({
  evidenceCurrent,
  handleClose,
}: Props) {
  const [refreshData, setRefreshData] = useState<boolean>(false);

  return (
    <Dialog
      fullScreen
      open={!!evidenceCurrent}
      onClose={() => handleClose(refreshData)}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => handleClose(refreshData)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            #{evidenceCurrent?.id} Detalles del hallazgo
          </Typography>
        </Toolbar>
      </AppBar>
      {evidenceCurrent && (
        <DetailsEvidence
          evidenceCurrent={evidenceCurrent}
          setRefreshData={setRefreshData}
        />
      )}
    </Dialog>
  );
}
