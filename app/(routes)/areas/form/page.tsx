"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Stack } from "@mui/material";
import { Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { TransformComponent } from "react-zoom-pan-pinch";

import { AreasService } from "@services";
import SelectManufacturingPlantsOwn from "@components/SelectManufacturingPlantsOwn";

const AreasFormPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: "",
    manufacturingPlantId: "",
  });
  const [idCurrent, setIdCurrent] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const save = () => {
    const nameClean = form.name.trim();
    const manufacturingPlantId = Number(form.manufacturingPlantId);

    if (!nameClean) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!manufacturingPlantId) {
      toast.error("La planta es requerida");
      return;
    }

    setIsLoading(true);

    if (!idCurrent) {
      AreasService.create({
        name: nameClean,
        manufacturingPlantId,
      })
        .then(() => {
          toast.success("Área creada correctamente");
          cancel();
        })
        .finally(() => setIsLoading(false));
    } else {
      AreasService.update(idCurrent, {
        name: nameClean,
        manufacturingPlantId,
      })
        .then(() => {
          toast.success("Área actualizada correctamente");
          cancel();
        })
        .finally(() => setIsLoading(false));
    }
  };

  const cancel = () => {
    router.push("/areas");
  };

  const isValidateForm = useMemo(
    () => !form.name?.trim() || !form.manufacturingPlantId,
    [form],
  );

  useEffect(() => {
    const id = Number(searchParams.get("id") || 0);
    if (!id) return;

    setIdCurrent(id);
    AreasService.findOne(id).then((data) => {
      setForm({
        name: data.name,
        manufacturingPlantId: `${data.manufacturingPlant?.id || ""}`,
      });
    });
  }, [searchParams]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
      >
        <Paper>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            autoComplete="off"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </Paper>
      </Grid>
      <SelectManufacturingPlantsOwn
        value={form.manufacturingPlantId}
        onChange={(e) =>
          setForm({
            ...form,
            manufacturingPlantId: e.target.value,
          })
        }
      />
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 2.5,
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
          sm: 6,
          md: 2.5,
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

      <Grid
        size={{
          xs: 12,
        }}
        sx={{
          display: "flex",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            flex: 1,
            minHeight: { xs: 320, md: 480 },
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflow: "hidden",
          }}
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={6}
            wheel={{ step: 0.12 }}
            centerOnInit
            doubleClick={{ disabled: true }}
            pinch={{ step: 5 }}
            panning={{ velocityDisabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  justifyContent="space-between"
                  gap={1}
                >
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => zoomIn()}
                    >
                      Acercar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<RemoveIcon />}
                      onClick={() => zoomOut()}
                    >
                      Alejar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<RestartAltIcon />}
                      onClick={() => resetTransform()}
                    >
                      Reset
                    </Button>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Usa rueda del mouse para zoom y arrastra para moverte
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    width: "100%",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                    contentStyle={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/planos.svg"
                      alt="Planos"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      draggable={false}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    />
                  </TransformComponent>
                </Box>
              </>
            )}
          </TransformWrapper>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AreasFormPage;
