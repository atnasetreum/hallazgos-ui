import { useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
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
      TransitionComponent={Transition}
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
              width: 500,
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

      {/*  <div style={{ width: "100%", border: "1px solid #ccc" }}>
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: canvasWidth,
            height: canvasHeight,
            className: "sigCanvas",
          }}
          penColor="black"
          minWidth={1}
          maxWidth={3}
        />
        <div>
          <button onClick={clearSignature}>Clear</button>
          <button onClick={saveSignature}>Save Signature</button>
        </div>
      </div> */}
    </Dialog>
  );
}
