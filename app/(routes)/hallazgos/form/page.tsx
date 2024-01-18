"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PartyModeIcon from "@mui/icons-material/PartyMode";
import ButtonGroup from "@mui/material/ButtonGroup";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import { v4 as uuidv4 } from "uuid";

import { EvidencesService, handleErrorResponse } from "@services";
import { SecondaryType } from "@interfaces";
import { useCategoriesStore, useUserSessionStore } from "@store";
import { dataURLtoFile, notify } from "@shared/utils";
import SelectDefault from "@components/SelectDefault";

import "react-html5-camera-photo/build/css/index.css";
import "./form.css";

export default function HallazgosFormPage() {
  const [typeHallazgo, setTypeHallazgo] = useState<string>("");
  const [secondaryType, setSecondaryType] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [zone, setZone] = useState<string>("");
  const [manufacturingPlantId, setManufacturingPlantId] = useState<string>("");
  const [secondaryTypes, setSecondaryTypes] = useState<SecondaryType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mainTypes, zones } = useCategoriesStore();

  const manufacturingPlants = useUserSessionStore(
    (state) => state.manufacturingPlants
  );

  const manufacturingPlantsCurrent = useUserSessionStore(
    (state) => state.manufacturingPlantsCurrent
  );

  const router = useRouter();

  useEffect(() => {
    if (manufacturingPlantsCurrent.length === 1) {
      setManufacturingPlantId(`${manufacturingPlantsCurrent[0]}`);
    } else {
      setManufacturingPlantId("");
    }
  }, [manufacturingPlantsCurrent]);

  useEffect(() => {
    if (typeHallazgo) {
      setSecondaryTypes(
        mainTypes.find((data) => data.id === Number(typeHallazgo))
          ?.secondaryTypes || []
      );
    }
  }, [typeHallazgo, mainTypes]);

  const isValidForm = useMemo(
    () =>
      (manufacturingPlantId &&
        typeHallazgo &&
        secondaryType &&
        zone &&
        image) ||
      isLoading,
    [manufacturingPlantId, typeHallazgo, secondaryType, zone, image, isLoading]
  );

  const saveEvidence = async () => {
    const formData = new FormData();

    formData.append("manufacturingPlantId", manufacturingPlantId);
    formData.append("typeHallazgo", typeHallazgo);
    formData.append("type", secondaryType);
    formData.append("zone", zone);

    const uuid = uuidv4();

    formData.append("file", dataURLtoFile(image, `${uuid}-evidence.png`));

    setIsLoading(true);
    EvidencesService.create(formData)
      .then(() => {
        notify("Hallazgo creado correctamente", true);
        router.push("/hallazgos");
      })
      .catch(handleErrorResponse)
      .finally(() => setIsLoading(false));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <SelectDefault
          data={manufacturingPlants}
          label="Planta"
          value={manufacturingPlantId}
          onChange={(e) => setManufacturingPlantId(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SelectDefault
          data={mainTypes}
          label="Hallazgo"
          value={typeHallazgo}
          onChange={(e) => {
            setTypeHallazgo(e.target.value);
            setSecondaryType("");
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SelectDefault
          data={secondaryTypes}
          label="Tipo"
          value={secondaryType}
          onChange={(e) => setSecondaryType(e.target.value)}
          helperText={!typeHallazgo ? "Seleccione un hallazgo" : ""}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SelectDefault
          data={zones}
          label="Zona"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        />
      </Grid>

      {manufacturingPlantId && typeHallazgo && secondaryType && zone && (
        <>
          <Grid item xs={12} sm={12} md={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Paper sx={{ p: 2 }}>
                {!image ? (
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
              disabled={isLoading}
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
