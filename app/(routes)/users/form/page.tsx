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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { UsersService } from "@services";
import MultiSelectManufacturingPlants from "@components/MultiSelectManufacturingPlants";
import MultiSelectZones from "@components/MultiSelectZones";
import { isValidEmail } from "@shared/utils";
import MultiSelectProcesses from "@components/MultiSelectProcesses";

const UsersFormPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [idCurrent, setIdCurrent] = useState<number>(0);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    rule: string;
    manufacturingPlantNames: string[];
    zoneNames: string[];
    processNames: string[];
  }>({
    name: "",
    email: "",
    password: "",
    rule: "",
    manufacturingPlantNames: [],
    zoneNames: [],
    processNames: [],
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const save = () => {
    const nameClean = form.name.trim();
    const emailClean = form.email.trim();
    const passwordClean = form.password.trim();

    if (!nameClean) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!emailClean) {
      toast.error("El correo electrónico es requerido");
      return;
    }

    if (!isValidEmail(emailClean)) {
      toast.error("El correo electrónico no es válido");
      return;
    }

    if (!idCurrent && !passwordClean) {
      toast.error("La contraseña es requerida");
      return;
    }

    if (!form.manufacturingPlantNames.length) {
      toast.error("La planta de manufactura es requerida");
      return;
    }

    if (form.rule === "Supervisor" && !form.zoneNames.length) {
      toast.error("La zona es requerida");
      return;
    }

    setIsLoading(true);

    const payload = {
      name: nameClean,
      email: emailClean,
      password: passwordClean,
      rule: form.rule,
      manufacturingPlantNames: form.manufacturingPlantNames,
      zoneNames: form.rule === "Supervisor" ? form.zoneNames : [],
      processNames: form.rule === "Supervisor" ? form.processNames : [],
    };

    if (!idCurrent) {
      UsersService.create(payload)
        .then(() => {
          toast.success("Usuario creado correctamente");
          cancel();
        })
        .finally(() => setIsLoading(false));
    } else {
      UsersService.update(idCurrent, payload)
        .then(() => {
          toast.success("Usuario actualizado correctamente");
          cancel();
        })
        .finally(() => setIsLoading(false));
    }
  };

  const cancel = () => {
    router.push("/users");
  };

  const isValidateForm = useMemo(
    () =>
      !form.name?.trim() ||
      !form.email?.trim() ||
      (!idCurrent && !form.password?.trim()) ||
      !form.rule?.trim() ||
      !form.manufacturingPlantNames?.length,
    [form, idCurrent]
  );

  useEffect(() => {
    const id = Number(searchParams.get("id") || 0);
    if (!id) return;

    setIdCurrent(id);
    UsersService.findOne(id).then((data) => {
      const zoneNames =
        data.role === "Supervisor"
          ? data.zones.map(
              (zone) => `${zone.manufacturingPlant.name} - ${zone.name}`
            )
          : [];

      const processNames =
        data.role === "Supervisor"
          ? data.processes.map(
              (process) =>
                `${process.manufacturingPlant.name} - ${process.name}`
            )
          : [];

      setForm({
        name: data.name,
        email: data.email,
        password: "",
        rule: data.role,
        manufacturingPlantNames: data.manufacturingPlants.map(
          (plant) => plant.name
        ),
        zoneNames,
        processNames,
      });
    });
  }, [searchParams]);

  return (
    <>
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
            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              autoComplete="off"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper>
            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              autoComplete="off"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper>
            <FormControl fullWidth>
              <InputLabel id="rule-select-label">Rol</InputLabel>
              <Select
                labelId="rule-select-label"
                id="rule-select"
                value={form.rule}
                label="Rol"
                onChange={(e: SelectChangeEvent) =>
                  setForm({
                    ...form,
                    rule: e.target.value as string,
                  })
                }
              >
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="Supervisor">Supervisor</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {form.rule && (
          <Grid item xs={12} sm={6} md={4}>
            <Paper>
              <MultiSelectManufacturingPlants
                values={form.manufacturingPlantNames}
                onChange={(values) => {
                  setForm({
                    ...form,
                    manufacturingPlantNames: values,
                  });
                }}
              />
            </Paper>
          </Grid>
        )}

        {form.rule === "Supervisor" &&
          !!form.manufacturingPlantNames.length && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Paper>
                  <MultiSelectZones
                    values={form.zoneNames}
                    onChange={(values) => {
                      setForm({
                        ...form,
                        zoneNames: values,
                      });
                    }}
                    manufacturingPlantNames={form.manufacturingPlantNames}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper>
                  <MultiSelectProcesses
                    values={form.processNames}
                    onChange={(values) => {
                      setForm({
                        ...form,
                        processNames: values,
                      });
                    }}
                    manufacturingPlantNames={form.manufacturingPlantNames}
                  />
                </Paper>
              </Grid>
            </>
          )}
      </Grid>
      <Grid
        container
        spacing={2}
        alignContent={"center"}
        justifyContent={"center"}
        sx={{ marginTop: 2 }}
      >
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
    </>
  );
};

export default UsersFormPage;
