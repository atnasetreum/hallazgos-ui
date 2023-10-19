"use client";

import * as React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PartyModeIcon from "@mui/icons-material/PartyMode";
import ButtonGroup from "@mui/material/ButtonGroup";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import Camera from "react-html5-camera-photo";
import SignatureCanvas from "react-signature-canvas";

import "react-html5-camera-photo/build/css/index.css";
import "./form.css";

export default function HallazgosFormPage() {
  const [typeHallazgo, setTypeHallazgo] = React.useState("");
  const [type, setType] = React.useState("");
  const [image, setImage] = React.useState("");
  const [zone, setZone] = React.useState("");
  const [types, setTypes] = React.useState<string[]>([]);
  const [imageURLSig, setImageURLSig] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const sigPad = React.useRef<SignatureCanvas | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (typeHallazgo) {
      switch (typeHallazgo) {
        case "comportamiento":
          setTypes([
            "Manipulación de máquina con sensores de seguridad activados",
            "Uso de paro de emergencia",
            "Uso adecuado de EPP",
            "Uso de guardas de seguridad",
            "Levantamiento de cargas no mayor a 25 kl (Hombre)",
            "Levantamiento de cargas no mayor a 12.5 kl (Mujer)",
          ]);
          break;
        case "condicion":
          setTypes([
            "Máquina sin guarda de seguridad",
            "Sensor de seguridad sin funcionamiento",
            "Escalera en mal estado",
            "Fuga de aceite",
            "Tubería sin aislamiento de calor",
          ]);
          break;
        default:
          setTypes([]);
      }
    }
  }, [typeHallazgo]);

  const saveSig = () => {
    if (sigPad.current) {
      setImageURLSig(sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
    }
  };

  const isValidForm = React.useMemo(() => {
    return typeHallazgo && type && zone && image && imageURLSig;
  }, [typeHallazgo, type, zone, image, imageURLSig]);

  const saveEvidence = async () => {
    setIsLoading(true);
    const response = await fetch("/api/hallazgos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        typeHallazgo,
        type,
        zone,
        image,
        imageURLSig,
      }),
    });
    if (response.ok) {
      router.push("/hallazgos");
    } else {
      alert("Error al guardar hallazgo");
    }
    setIsLoading(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4} md={4}>
        <Paper sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Hallazgo</InputLabel>
            <Select
              value={typeHallazgo}
              onChange={(e) => {
                setTypeHallazgo(e.target.value);
                setType("");
              }}
              label="Hallazgo"
            >
              <MenuItem value={"comportamiento"}>
                Comportamiento inseguro
              </MenuItem>
              <MenuItem value={"condicion"}>Condición insegura</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Tipo"
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Zona</InputLabel>
            <Select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              label="Zona"
            >
              <MenuItem value={"PTAR"}>PTAR</MenuItem>
              <MenuItem value={"SAPONIFICACION"}>SAPONIFICACION</MenuItem>
              <MenuItem value={"SECADO"}>SECADO</MenuItem>
              <MenuItem value={"MANTENIMIENTO"}>MANTENIMIENTO</MenuItem>
              <MenuItem value={"LOGISTICA"}>LOGISTICA</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Grid>
      {typeHallazgo && type && zone && (
        <>
          <Grid item xs={12} sm={6} md={6}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Paper sx={{ p: 2 }}>
                {!image ? (
                  <Camera onTakePhoto={(dataUri) => setImage(dataUri)} />
                ) : (
                  <>
                    <Image
                      src={image}
                      alt="Evidencia de hallazgo"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PartyModeIcon />}
                      onClick={() => setImage("")}
                    >
                      Volver a tomar evidencia
                    </Button>
                  </>
                )}
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Paper sx={{ p: 2 }}>
                <h3>Firma digital</h3>
                {!imageURLSig ? (
                  <div className="sigContainer">
                    <SignatureCanvas
                      ref={(ref) => {
                        sigPad.current = ref;
                      }}
                      canvasProps={{
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                ) : (
                  <Image
                    src={imageURLSig}
                    alt="Firma"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  <Button
                    fullWidth
                    startIcon={<CleaningServicesIcon />}
                    onClick={() => {
                      setImageURLSig("");
                      if (sigPad.current) {
                        sigPad.current.clear();
                      }
                    }}
                  >
                    Borrar firma
                  </Button>
                  {!imageURLSig && (
                    <Button
                      fullWidth
                      startIcon={<CheckIcon />}
                      onClick={saveSig}
                    >
                      Confirmar firma
                    </Button>
                  )}
                </ButtonGroup>
              </Paper>
            </Box>
          </Grid>
        </>
      )}
      <Grid item xs={12} sm={12} md={12}>
        <Paper sx={{ p: 2 }}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            fullWidth
          >
            <Button
              fullWidth
              startIcon={<ClearIcon />}
              onClick={() => router.push("/hallazgos")}
              color="error"
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              startIcon={<SaveIcon />}
              onClick={saveEvidence}
              disabled={!isValidForm || isLoading}
            >
              Crear hallazgo
            </Button>
          </ButtonGroup>
        </Paper>
      </Grid>
    </Grid>
  );
}
