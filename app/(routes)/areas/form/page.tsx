"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";

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

type ZoomViewportProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  children: ReactNode;
};

const ZoomViewport = ({ onZoomIn, onZoomOut, children }: ZoomViewportProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wheelAccumulatorRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      wheelAccumulatorRef.current += event.deltaY;

      const threshold = 100;
      if (Math.abs(wheelAccumulatorRef.current) < threshold) {
        return;
      }

      if (wheelAccumulatorRef.current > 0) {
        onZoomOut();
      } else {
        onZoomIn();
      }

      wheelAccumulatorRef.current = 0;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [onZoomIn, onZoomOut]);

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        minHeight: 0,
        height: "100%",
        width: "100%",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: "hidden",
        overscrollBehavior: "none",
        cursor: "grab",
        "&:active": {
          cursor: "grabbing",
        },
      }}
    >
      {children}
    </Box>
  );
};

const AreasFormPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const [selectedPoint, setSelectedPoint] = useState<{
    x: number;
    y: number;
    percentX: number;
    percentY: number;
  } | null>(null);
  const [imageNaturalSize, setImageNaturalSize] = useState({
    width: 0,
    height: 0,
  });
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

  const selectPointFromPointer = (
    target: HTMLDivElement,
    clientX: number,
    clientY: number,
  ) => {
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    const percentX = (offsetX / rect.width) * 100;
    const percentY = (offsetY / rect.height) * 100;

    const x = imageNaturalSize.width
      ? Math.round((offsetX / rect.width) * imageNaturalSize.width)
      : Math.round(offsetX);
    const y = imageNaturalSize.height
      ? Math.round((offsetY / rect.height) * imageNaturalSize.height)
      : Math.round(offsetY);

    setSelectedPoint({
      x,
      y,
      percentX,
      percentY,
    });
  };

  const handleImagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    isDraggingRef.current = false;
  };

  const handleImagePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current) {
      return;
    }

    const deltaX = Math.abs(event.clientX - pointerStartRef.current.x);
    const deltaY = Math.abs(event.clientY - pointerStartRef.current.y);
    if (deltaX > 6 || deltaY > 6) {
      isDraggingRef.current = true;
    }
  };

  const handleImagePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current) {
      return;
    }

    if (!isDraggingRef.current) {
      selectPointFromPointer(event.currentTarget, event.clientX, event.clientY);
    }

    pointerStartRef.current = null;
    isDraggingRef.current = false;
  };

  const handleImagePointerCancel = () => {
    pointerStartRef.current = null;
    isDraggingRef.current = false;
  };

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
          pt: "0 !important",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            flex: 1,
            minHeight: { xs: 320, md: 420 },
            height: { xs: "56vh", md: "68vh" },
            maxHeight: "calc(100vh - 210px)",
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
            maxScale={30}
            wheel={{ disabled: true }}
            centerOnInit
            pinch={{ step: 5 }}
            panning={{ disabled: false, velocityDisabled: true }}
            doubleClick={{ disabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform, state }) => {
              const markerScale = 1 / Math.max(state.scale, 0.0001);

              return (
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
                      Rueda del mouse: zoom | arrastra con cursor para moverte
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPoint
                        ? `Punto seleccionado: X ${selectedPoint.x}, Y ${selectedPoint.y}`
                        : "Haz click sobre la imagen para marcar un punto"}
                    </Typography>
                  </Stack>

                  <ZoomViewport onZoomIn={zoomIn} onZoomOut={zoomOut}>
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
                        onPointerDown={handleImagePointerDown}
                        onPointerMove={handleImagePointerMove}
                        onPointerUp={handleImagePointerUp}
                        onPointerCancel={handleImagePointerCancel}
                        sx={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          aspectRatio:
                            imageNaturalSize.width && imageNaturalSize.height
                              ? `${imageNaturalSize.width} / ${imageNaturalSize.height}`
                              : "16 / 9",
                          userSelect: "none",
                          cursor: "crosshair",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/planos.png"
                          alt="Planos"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          draggable={false}
                          onLoad={(
                            event: React.SyntheticEvent<HTMLImageElement>,
                          ) => {
                            const target = event.currentTarget;
                            setImageNaturalSize({
                              width: target.naturalWidth,
                              height: target.naturalHeight,
                            });
                          }}
                          sx={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            userSelect: "none",
                            pointerEvents: "none",
                          }}
                        />

                        {selectedPoint && (
                          <Box
                            sx={{
                              position: "absolute",
                              left: `${selectedPoint.percentX}%`,
                              top: `${selectedPoint.percentY}%`,
                              transform: "translate(-50%, -50%)",
                              pointerEvents: "none",
                              zIndex: 2,
                            }}
                          >
                            <Box
                              sx={{
                                transform: `scale(${markerScale})`,
                                transformOrigin: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  border: "3px solid #ffffff",
                                  backgroundColor: "#ff1744",
                                  boxShadow:
                                    "0 0 0 4px rgba(255, 23, 68, 0.35)",
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </TransformComponent>
                  </ZoomViewport>
                </>
              );
            }}
          </TransformWrapper>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AreasFormPage;
