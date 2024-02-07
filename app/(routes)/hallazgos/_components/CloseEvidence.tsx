import { useState } from "react";

import Image from "next/image";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import PartyModeIcon from "@mui/icons-material/PartyMode";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import { v4 as uuidv4 } from "uuid";

import { dataURLtoFile, notify } from "@shared/utils";
import { EvidencesService, handleErrorResponse } from "@services";

import "react-html5-camera-photo/build/css/index.css";

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

  const saveSolution = () => {
    const formData = new FormData();

    const uuid = uuidv4();

    formData.append("file", dataURLtoFile(image, `${uuid}-solution.png`));

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
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Paper sx={{ p: 2 }}>
                {!image && idRow ? (
                  <Camera
                    onTakePhoto={(dataUri) => setImage(dataUri)}
                    idealFacingMode={FACING_MODES.ENVIRONMENT}
                  />
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PartyModeIcon />}
                      onClick={() => setImage("")}
                      disabled={isLoading}
                    >
                      Volver a tomar hallazgo
                    </Button>
                    <Image
                      src={image}
                      alt="Hallazgo"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={saveSolution}
          variant="contained"
          disabled={!image || isLoading}
        >
          Guardar imagen
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
