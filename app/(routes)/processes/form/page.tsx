"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";

import { ProcessesService } from "@services";
import SelectManufacturingPlants from "@components/SelectManufacturingPlants";

const ProcessesFormPage = () => {
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
      ProcessesService.create({
        name: nameClean,
        manufacturingPlantId,
      })
        .then(() => {
          toast.success("Proceso creado correctamente");
          cancel();
        })
        .finally(() => setIsLoading(false));
    } else {
      ProcessesService.update(idCurrent, {
        name: nameClean,
        manufacturingPlantId,
      })
        .then(() => {
          toast.success("Proceso actualizado correctamente");
          cancel();
        })
        .finally(() => setIsLoading(false));
    }
  };

  const cancel = () => {
    router.push("/processes");
  };

  const isValidateForm = useMemo(
    () => !form.name?.trim() || !form.manufacturingPlantId,
    [form]
  );

  useEffect(() => {
    const id = Number(searchParams.get("id") || 0);
    if (!id) return;

    setIdCurrent(id);
    ProcessesService.findOne(id).then((data) => {
      setForm({
        name: data.name,
        manufacturingPlantId: `${data.manufacturingPlant.id}`,
      });
    });
  }, [searchParams]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
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
      <Grid item xs={12} sm={6} md={3}>
        <Paper>
          <SelectManufacturingPlants
            value={form.manufacturingPlantId}
            onChange={(e) =>
              setForm({
                ...form,
                manufacturingPlantId: e.target.value,
              })
            }
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
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
      <Grid item xs={12} sm={3} md={3}>
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
  );
};

export default ProcessesFormPage;
