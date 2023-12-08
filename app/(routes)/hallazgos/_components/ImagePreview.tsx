import Image from "next/image";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

import { Evidence } from "@interfaces";
import { baseUrlImage, stringToDateWithTime } from "@shared/utils";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface Props {
  isOpen: boolean;
  setIsOpen: () => void;
  evidenceCurrent: Evidence | null;
}

export default function ImagePreview({
  isOpen,
  setIsOpen,
  evidenceCurrent,
}: Props) {
  const handleClose = () => setIsOpen();

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {evidenceCurrent?.manufacturingPlant.name +
          " - " +
          evidenceCurrent?.mainType.name}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          <b>Tipo de evidencia:</b> {evidenceCurrent?.secondaryType.name}
        </Typography>
        <Typography gutterBottom>
          <b>Zona:</b> {evidenceCurrent?.zone.name}
        </Typography>
        <Typography gutterBottom>
          <b>Creación:</b>{" "}
          {stringToDateWithTime(evidenceCurrent?.createdAt || "")}
        </Typography>
        <Typography gutterBottom>
          <b>Ultima actualización:</b>{" "}
          {stringToDateWithTime(evidenceCurrent?.updatedAt || "")}
        </Typography>
        <Image
          src={baseUrlImage(evidenceCurrent?.imgEvidence || "")}
          alt="Evidencia de hallazgo"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      </DialogContent>
    </BootstrapDialog>
  );
}
