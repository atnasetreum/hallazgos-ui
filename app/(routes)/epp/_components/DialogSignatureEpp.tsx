import { useRef } from "react";

import { Button } from "@mui/material";
import { Dialog } from "@mui/material";
import { AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Box } from "@mui/material";
import { Paper } from "@mui/material";
import { Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SignatureCanvas from "react-signature-canvas";

import { Transition } from "@routes/hallazgos/_components/EvidencePreview";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  setSignature: (signature: string) => void;
}

export default function DialogSignatureEpp({
  open,
  setOpen,
  setSignature,
}: Props) {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const canvasWidth = isMobile ? 300 : 500;

  const handleClose = () => {
    setOpen(false);
  };

  const clearSignature = () => {
    if (!sigCanvas.current) return;
    sigCanvas.current.clear();
  };

  const saveSignature = () => {
    if (!sigCanvas.current) return;
    const dataURL = sigCanvas.current.toDataURL();
    setSignature(dataURL);
    handleClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      slots={{ transition: Transition }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar></Toolbar>
      </AppBar>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 500, mx: "auto", mt: 10 }}>
        <Typography variant="h6" gutterBottom>
          Firma electrónica
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 1,
            overflow: "hidden",
            width: "100%",
            height: 200,
          }}
        >
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: canvasWidth,
              height: 200,
              style: { width: "100%", height: "100%" },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" onClick={clearSignature}>
            Limpiar
          </Button>
          <Button variant="contained" onClick={saveSignature}>
            Guardar
          </Button>
        </Box>
      </Paper>
    </Dialog>
  );
}
