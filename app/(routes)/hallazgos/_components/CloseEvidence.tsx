import { useState } from "react";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

import { dataURLtoFile, notify } from "@shared/utils";
import { EvidencesService, handleErrorResponse } from "@services";

import "react-html5-camera-photo/build/css/index.css";
import ImageORCamera from "@shared/components/ImageORCamera";

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
  handleClose: (refresh?: boolean) => void;
  idRow: number;
}

export default function CloseEvidence({ isOpen, handleClose, idRow }: Props) {
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const saveSolution = () => {
    const formData = new FormData();

    const uuid = uuidv4();

    if (image) {
      formData.append("file", dataURLtoFile(image, `${uuid}-solution.png`));
    } else if (attachedFile) {
      const extension = attachedFile.name.split(".").pop();

      const nameWithUuid = `${uuid}-solution.${extension}`;

      formData.append("file", attachedFile, nameWithUuid);
    }

    setIsLoading(true);
    EvidencesService.solution(idRow, formData)
      .then(() => {
        notify("Hallazgo creado correctamente", true);
        handleClose(true);
      })
      .catch(handleErrorResponse)
      .finally(() => setIsLoading(false));
  };

  return (
    <BootstrapDialog
      onClose={() => handleClose()}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      fullWidth={true}
      maxWidth={false}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Imagen la solución
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => handleClose()}
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
        <ImageORCamera
          setImage={setImage}
          image={image}
          setAttachedFile={setAttachedFile}
          attachedFile={attachedFile}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={saveSolution}
          variant="contained"
          disabled={!(image || attachedFile) || isLoading}
        >
          Guardar imagen
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
