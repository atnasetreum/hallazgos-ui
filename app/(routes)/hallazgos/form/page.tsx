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
import { v4 as uuidv4 } from "uuid";

import {
  EvidencesService,
  MainTypesService,
  SecondaryTypesService,
  ZonesService,
} from "@services";
import { MainType, SecondaryType, Zone } from "@interfaces";
import { useUserSessionStore } from "@store";
import { dataURLtoFile, notify } from "@shared/utils";

import "react-html5-camera-photo/build/css/index.css";
import "./form.css";

export default function HallazgosFormPage() {
  const [typeHallazgo, setTypeHallazgo] = React.useState("");
  const [type, setType] = React.useState("");
  const [image, setImage] = React.useState("");
  const [zone, setZone] = React.useState("");
  const [manufacturingPlantId, setManufacturingPlantId] = React.useState("");

  const [mainTypes, setMainTypes] = React.useState<MainType[]>([]);
  const [types, setTypes] = React.useState<SecondaryType[]>([]);
  const [zones, setZones] = React.useState<Zone[]>([]);

  const [imageURLSig, setImageURLSig] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const manufacturingPlants = useUserSessionStore(
    (state) => state.manufacturingPlants
  );

  const manufacturingPlantsCurrent = useUserSessionStore(
    (state) => state.manufacturingPlantsCurrent
  );

  const sigPad = React.useRef<SignatureCanvas | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    if (manufacturingPlantsCurrent.length === 1) {
      setManufacturingPlantId(`${manufacturingPlantsCurrent[0]}`);
    } else {
      setManufacturingPlantId("");
    }
  }, [manufacturingPlantsCurrent]);

  React.useEffect(() => {
    if (typeHallazgo) {
      SecondaryTypesService.findAllByManufacturingPlant(
        Number(typeHallazgo)
      ).then(setTypes);
    }
  }, [typeHallazgo]);

  React.useEffect(() => {
    MainTypesService.findAll().then(setMainTypes);
    ZonesService.findAll().then(setZones);
  }, []);

  const saveSig = () => {
    if (sigPad.current) {
      setImageURLSig(sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
    }
  };

  const isValidForm = React.useMemo(
    () =>
      (manufacturingPlantId &&
        typeHallazgo &&
        type &&
        zone &&
        image &&
        imageURLSig) ||
      isLoading,
    [
      manufacturingPlantId,
      typeHallazgo,
      type,
      zone,
      image,
      imageURLSig,
      isLoading,
    ]
  );

  const saveEvidence = async () => {
    const formData = new FormData();

    formData.append("manufacturingPlantId", manufacturingPlantId);
    formData.append("typeHallazgo", typeHallazgo);
    formData.append("type", type);
    formData.append("zone", zone);

    const uuid = uuidv4();

    formData.append("files", dataURLtoFile(image, `${uuid}-evidence.png`));

    formData.append(
      "files",
      dataURLtoFile(imageURLSig, `${uuid}-signature.png`)
    );

    setIsLoading(true);
    EvidencesService.create(formData)
      .then(() => {
        notify("Hallazgo creado correctamente", true);
        router.push("/hallazgos");
      })
      .catch((err) => {
        console.error(err);
        notify("Ocurrió un error al crear el hallazgo");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Planta</InputLabel>
            <Select
              value={manufacturingPlantId}
              onChange={(e) => {
                setManufacturingPlantId(e.target.value);
              }}
              label="Planta"
            >
              {manufacturingPlants.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
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
              {mainTypes.map((mainType) => (
                <MenuItem key={mainType.id} value={mainType.id}>
                  {mainType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Tipo"
            >
              {types.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Zona</InputLabel>
            <Select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              label="Zona"
            >
              {zones.map((zone) => (
                <MenuItem key={zone.id} value={zone.id}>
                  {zone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Grid>

      {manufacturingPlantId && typeHallazgo && type && zone && (
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
