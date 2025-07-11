import { use, useEffect, useMemo, useState } from "react";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";

import { dataURLtoFile, notify } from "@shared/utils";
import { EvidencesService, handleErrorResponse } from "@services";

import "react-html5-camera-photo/build/css/index.css";
import ImageORCamera from "@shared/components/ImageORCamera";
import { EvidenceGraphql } from "@hooks";
import { Grid, Paper, TextField } from "@mui/material";

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
  evidenceCurrent: EvidenceGraphql | null;
}

export default function CloseEvidence({
  isOpen,
  handleClose,
  idRow,
  evidenceCurrent,
}: Props) {
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [descriptionSolution, setDescriptionSolution] = useState<string>("");
  const [isUnsafeBehavior, setIsUnsafeBehavior] = useState<boolean>(false);

  useEffect(() => {
    if (!evidenceCurrent) return;
    const { name } = evidenceCurrent.mainType;
    if (!name.toLocaleLowerCase().includes("comportamiento inseguro")) return;
    setIsUnsafeBehavior(true);
  }, [evidenceCurrent]);

  const currentDescriptionSolution = useMemo(
    () => descriptionSolution.trim(),
    [descriptionSolution]
  );

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

    formData.append("descriptionSolution", descriptionSolution);

    setIsLoading(true);
    EvidencesService.solution(idRow, formData)
      .then(() => {
        notify("Hallazgo cerrado correctamente", true);
        handleClose(true);
      })
      .catch(handleErrorResponse)
      .finally(() => setIsLoading(false));
  };

  const isDisabled = useMemo(() => {
    //return !(image || attachedFile) || isLoading;
    return isUnsafeBehavior
      ? !currentDescriptionSolution || isLoading
      : !(image || attachedFile) || isLoading;
  }, [
    image,
    attachedFile,
    isLoading,
    currentDescriptionSolution,
    isUnsafeBehavior,
  ]);

  return (
    <BootstrapDialog
      onClose={() => handleClose()}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      fullWidth={true}
      maxWidth={false}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Imagen la solución{" "}
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
        <Grid container spacing={2}>
          {isUnsafeBehavior && (
            <Grid item xs={12} sm={6} md={6}>
              <b>
                {evidenceCurrent?.description
                  ? `Descripción del comportamiento inseguro: `
                  : ""}
              </b>
              {evidenceCurrent?.description ? evidenceCurrent.description : ""}
            </Grid>
          )}

          {isUnsafeBehavior && (
            <Grid item xs={12} sm={6} md={6}>
              <Paper sx={{ p: 2 }}>
                <TextField
                  id="description-multiline-solution"
                  multiline
                  rows={2}
                  variant="standard"
                  fullWidth
                  value={descriptionSolution}
                  onChange={(e) => setDescriptionSolution(e.target.value)}
                  label={
                    currentDescriptionSolution
                      ? "Descripción de la solución"
                      : ""
                  }
                  helperText={
                    !currentDescriptionSolution
                      ? "Por favor, ingrese una descripción de la solución"
                      : ""
                  }
                  error={!currentDescriptionSolution}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <ImageORCamera
            setImage={setImage}
            image={image}
            setAttachedFile={setAttachedFile}
            attachedFile={attachedFile}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={saveSolution}
          variant="contained"
          disabled={isDisabled}
        >
          Guardar imagen
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
