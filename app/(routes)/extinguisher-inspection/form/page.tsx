"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { toast } from "sonner";
import jsQR from "jsqr";

import SelectManufacturingPlantsOwn from "@components/SelectManufacturingPlantsOwn";
import {
  EmergencyTeamsService,
  ExtinguisherInspectionsService,
} from "@services";
import { EmergencyTeam, EvaluationValues, ExtinguisherType } from "@interfaces";

interface LocalEvaluation {
  emergencyTeamId: number;
  location: string;
  extinguisherNumber: string;
  typeOfExtinguisher: ExtinguisherType;
  capacity: string;
  pressureManometer: EvaluationValues;
  valve: EvaluationValues;
  hose: EvaluationValues;
  cylinder: EvaluationValues;
  barrette: EvaluationValues;
  seal: EvaluationValues;
  cornet: EvaluationValues;
  access: EvaluationValues;
  support: EvaluationValues;
  signaling: EvaluationValues;
  observations: string;
}

const evaluationValues = [
  EvaluationValues.C,
  EvaluationValues.NC,
  EvaluationValues.NA,
];

const evaluationSelectFields: Array<{
  key: keyof LocalEvaluation;
  label: string;
}> = [
  { key: "pressureManometer", label: "Manómetro" },
  { key: "valve", label: "Válvula" },
  { key: "hose", label: "Manguera" },
  { key: "cylinder", label: "Cilindro" },
  { key: "barrette", label: "Pasador" },
  { key: "seal", label: "Sello" },
  { key: "cornet", label: "Corneta" },
  { key: "access", label: "Acceso" },
  { key: "support", label: "Soporte" },
  { key: "signaling", label: "Señalización" },
];

const getDefaultEvaluationFromEmergencyTeam = (
  emergencyTeam: EmergencyTeam,
): LocalEvaluation => ({
  emergencyTeamId: emergencyTeam.id,
  location: emergencyTeam.location,
  extinguisherNumber: emergencyTeam.extinguisherNumber.toString(),
  typeOfExtinguisher: emergencyTeam.typeOfExtinguisher,
  capacity: emergencyTeam.capacity.toString(),
  pressureManometer: EvaluationValues.C,
  valve: EvaluationValues.C,
  hose: EvaluationValues.C,
  cylinder: EvaluationValues.C,
  barrette: EvaluationValues.C,
  seal: EvaluationValues.C,
  cornet: EvaluationValues.C,
  access: EvaluationValues.C,
  support: EvaluationValues.C,
  signaling: EvaluationValues.C,
  observations: "",
});

const ExtinguisherInspectionFormPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerError, setScannerError] = useState<string>("");
  const [scannerInfo, setScannerInfo] = useState<string>("");

  const [form, setForm] = useState({
    manufacturingPlantId: "",
    inspectionDate: "",
    sharedNextRechargeDate: "",
    evaluations: [] as LocalEvaluation[],
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const scanningRef = useRef<boolean>(false);

  const router = useRouter();

  const cancel = () => {
    router.push("/extinguisher-inspection");
  };

  const stopScanner = () => {
    scanningRef.current = false;
    detectorRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const detectWithJsQr = () => {
    if (!videoRef.current || !canvasRef.current) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return null;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: "dontInvert",
    });

    return code?.data || null;
  };

  const parseQrToEmergencyTeamId = (rawValue: string) => {
    const onlyNumber = rawValue.trim();
    if (/^\d+$/.test(onlyNumber)) {
      return Number(onlyNumber);
    }

    const match = rawValue.match(/\d+/);
    if (match) {
      return Number(match[0]);
    }

    return null;
  };

  const handleDetectedQr = async (rawValue: string) => {
    const emergencyTeamId = parseQrToEmergencyTeamId(rawValue);

    if (!emergencyTeamId) {
      toast.error("El QR no contiene un ID válido");
      return;
    }

    try {
      const emergencyTeam =
        await EmergencyTeamsService.findOne(emergencyTeamId);

      if (!form.manufacturingPlantId) {
        toast.error("Seleccione una planta antes de crear una evaluación");
        return;
      }

      if (
        Number(form.manufacturingPlantId) !==
        emergencyTeam.manufacturingPlant?.id
      ) {
        toast.error(
          "El equipo escaneado pertenece a una planta diferente a la seleccionada",
        );
        return;
      }

      setForm((prev) => {
        const alreadyExists = prev.evaluations.some(
          (evaluation) => evaluation.emergencyTeamId === emergencyTeam.id,
        );

        if (alreadyExists) {
          toast.error("Ese equipo ya fue agregado en las evaluaciones");
          return prev;
        }

        return {
          ...prev,
          evaluations: [
            ...prev.evaluations,
            getDefaultEvaluationFromEmergencyTeam(emergencyTeam),
          ],
        };
      });

      setIsScannerOpen(false);
      stopScanner();
      toast.success(`Equipo #${emergencyTeam.id} agregado a la inspección`);
    } catch {
      toast.error("No se pudo obtener el equipo de emergencia desde el QR");
    }
  };

  const startScanner = async () => {
    setScannerError("");
    setScannerInfo("");

    const BarcodeDetectorConstructor = (window as any).BarcodeDetector;

    try {
      if (BarcodeDetectorConstructor) {
        detectorRef.current = new BarcodeDetectorConstructor({
          formats: ["qr_code"],
        });
      } else {
        detectorRef.current = null;
        setScannerInfo(
          "Escaneo en modo compatible activado para este navegador (fallback).",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });

      streamRef.current = stream;
      scanningRef.current = true;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const scanFrame = async () => {
        if (!scanningRef.current || !videoRef.current) {
          return;
        }

        try {
          let rawValue: string | null = null;

          if (detectorRef.current) {
            const barcodes = await detectorRef.current.detect(videoRef.current);
            if (barcodes.length && barcodes[0]?.rawValue) {
              rawValue = barcodes[0].rawValue;
            }
          } else {
            rawValue = detectWithJsQr();
          }

          if (rawValue) {
            await handleDetectedQr(rawValue);
            return;
          }
        } catch {
          // Ignore one-frame detector errors and continue scanning.
        }

        requestAnimationFrame(scanFrame);
      };

      requestAnimationFrame(scanFrame);
    } catch {
      setScannerError(
        "No se pudo acceder a la cámara. Verifique permisos del navegador.",
      );
      setScannerInfo("");
    }
  };

  const openScanner = () => {
    if (!form.manufacturingPlantId) {
      toast.error("Seleccione una planta antes de crear evaluación");
      return;
    }

    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
    stopScanner();
  };

  useEffect(() => {
    if (!isScannerOpen) {
      stopScanner();
      return;
    }

    void startScanner();

    return () => stopScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScannerOpen]);

  const updateEvaluation = (
    index: number,
    key: keyof LocalEvaluation,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      evaluations: prev.evaluations.map((evaluation, idx) =>
        idx === index ? { ...evaluation, [key]: value } : evaluation,
      ),
    }));
  };

  const removeEvaluation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      evaluations: prev.evaluations.filter((_, idx) => idx !== index),
    }));
  };

  const save = () => {
    if (!form.manufacturingPlantId) {
      toast.error("La planta es requerida");
      return;
    }

    if (!form.inspectionDate) {
      toast.error("La fecha de inspección es requerida");
      return;
    }

    if (!form.sharedNextRechargeDate) {
      toast.error("La fecha de próxima recarga es requerida");
      return;
    }

    if (!form.evaluations.length) {
      toast.error("Debe agregar al menos una evaluación");
      return;
    }

    setIsLoading(true);

    const payload = {
      inspectionDate: form.inspectionDate,
      manufacturingPlantId: Number(form.manufacturingPlantId),
      evaluations: form.evaluations.map((evaluation) => ({
        location: evaluation.location.trim(),
        extinguisherNumber: Number(evaluation.extinguisherNumber),
        typeOfExtinguisher: evaluation.typeOfExtinguisher,
        capacity: Number(evaluation.capacity),
        pressureManometer: evaluation.pressureManometer,
        valve: evaluation.valve,
        hose: evaluation.hose,
        cylinder: evaluation.cylinder,
        barrette: evaluation.barrette,
        seal: evaluation.seal,
        cornet: evaluation.cornet,
        access: evaluation.access,
        support: evaluation.support,
        signaling: evaluation.signaling,
        nextRechargeDate: form.sharedNextRechargeDate,
        maintenanceDate: form.sharedNextRechargeDate,
        observations: evaluation.observations.trim() || undefined,
      })),
    };

    ExtinguisherInspectionsService.create(payload)
      .then(() => {
        toast.success("Inspección creada correctamente");
        cancel();
      })
      .finally(() => setIsLoading(false));
  };

  const isValidateForm = useMemo(
    () =>
      !form.manufacturingPlantId ||
      !form.inspectionDate ||
      !form.sharedNextRechargeDate ||
      !form.evaluations.length,
    [form],
  );

  return (
    <>
      <Grid container spacing={2}>
        <SelectManufacturingPlantsOwn
          value={form.manufacturingPlantId}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              manufacturingPlantId: e.target.value,
              evaluations: [],
            }))
          }
        />

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Paper>
            <TextField
              type="date"
              label="Fecha inspección"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.inspectionDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  inspectionDate: e.target.value,
                }))
              }
            />
          </Paper>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Paper>
            <TextField
              type="date"
              label="Próxima recarga"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.sharedNextRechargeDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  sharedNextRechargeDate: e.target.value,
                }))
              }
            />
          </Paper>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 12,
          }}
        >
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6">Evaluaciones</Typography>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 12,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<QrCodeScannerIcon />}
            onClick={openScanner}
          >
            Crear evaluación
          </Button>
        </Grid>

        {form.evaluations.map((evaluation, index) => (
          <Grid
            key={`evaluation-${evaluation.emergencyTeamId}-${index}`}
            size={{
              xs: 12,
              sm: 12,
              md: 12,
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <TextField
                    label={`Ubicación #${index + 1}`}
                    fullWidth
                    value={evaluation.location}
                    disabled
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 2,
                  }}
                >
                  <TextField
                    label="N. Extintor"
                    fullWidth
                    value={evaluation.extinguisherNumber}
                    disabled
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 2,
                  }}
                >
                  <TextField
                    label="Tipo"
                    fullWidth
                    value={evaluation.typeOfExtinguisher}
                    disabled
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 2,
                  }}
                >
                  <TextField
                    label="Capacidad"
                    fullWidth
                    value={evaluation.capacity}
                    disabled
                  />
                </Grid>

                {evaluationSelectFields.map((field) => (
                  <Grid
                    key={`${field.key}-${evaluation.emergencyTeamId}`}
                    size={{ xs: 12, sm: 6, md: 3 }}
                  >
                    <TextField
                      select
                      label={field.label}
                      fullWidth
                      value={String(
                        evaluation[field.key] || EvaluationValues.C,
                      )}
                      onChange={(e) =>
                        updateEvaluation(index, field.key, e.target.value)
                      }
                    >
                      {evaluationValues.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                ))}

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Observaciones"
                    fullWidth
                    value={evaluation.observations}
                    onChange={(e) =>
                      updateEvaluation(index, "observations", e.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeEvaluation(index)}
                  >
                    Eliminar evaluación
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}

        <Grid
          size={{
            xs: 12,
            sm: 3,
            md: 3,
          }}
        >
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<CloseIcon />}
            onClick={cancel}
          >
            Cancelar
          </Button>
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 3,
            md: 3,
          }}
        >
          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            fullWidth
            onClick={save}
            disabled={isValidateForm || isLoading}
          >
            Guardar
          </LoadingButton>
        </Grid>
      </Grid>

      <Dialog
        open={isScannerOpen}
        onClose={closeScanner}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Escanear QR de Equipo de Emergencia</DialogTitle>
        <DialogContent>
          {!!scannerInfo && <Alert severity="info">{scannerInfo}</Alert>}

          {scannerError ? (
            <Alert severity="warning">{scannerError}</Alert>
          ) : (
            <Box sx={{ width: "100%", mt: 1 }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ width: "100%", borderRadius: 8, background: "#000" }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Apunte la cámara al QR impreso del equipo de emergencia.
              </Typography>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeScanner} startIcon={<CloseIcon />}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExtinguisherInspectionFormPage;
