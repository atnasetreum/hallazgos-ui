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

import { SecondaryTypesService } from "@services";
import SelectMainTypes from "@components/SelectMainTypes";

const SecondaryTypesFormPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: "",
    mainTypeId: "",
  });
  const [idCurrent, setIdCurrent] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const save = () => {
    const nameClean = form.name.trim();
    const mainTypeId = Number(form.mainTypeId);

    if (!nameClean) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!mainTypeId) {
      toast.error("El tipo de criterio es requerido");
      return;
    }

    setIsLoading(true);

    if (!idCurrent) {
      SecondaryTypesService.create({
        name: nameClean,
        mainTypeId,
      })
        .then(() => {
          toast.success("Tipo de criterio creado correctamente");
          cancel();
        })
        .finally(() => setIsLoading(false));
    } else {
      SecondaryTypesService.update(idCurrent, {
        name: nameClean,
        mainTypeId,
      })
        .then(() => {
          toast.success("Tipo de criterio actualizado correctamente");
          cancel();
        })
        .finally(() => setIsLoading(false));
    }
  };

  const cancel = () => {
    router.push("/secondary-types");
  };

  const isValidateForm = useMemo(() => !form.name?.trim(), [form]);

  useEffect(() => {
    const id = Number(searchParams.get("id") || 0);
    if (!id) return;

    setIdCurrent(id);
    SecondaryTypesService.findOne(id).then((data) => {
      setForm({
        name: data.name,
        mainTypeId: `${data.mainType.id}`,
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
          <SelectMainTypes
            value={form.mainTypeId}
            onChange={(e) =>
              setForm({
                ...form,
                mainTypeId: e.target.value,
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

export default SecondaryTypesFormPage;
