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
import MultiSelectMaintenanceSecurity from "@components/MultiSelectMaintenanceSecurity";
import MultiSelectZonesMaintenanceSecurity from "@components/MultiSelectZonesMaintenanceSecurity";

const UsersFormPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    rule: string;
    manufacturingPlantNames: string[];
    manufacturingPlantNamesMaintenanceSecurity: string[];
    zonesMaintenanceSecurity: string[];
    zoneNames: string[];
    typeResponsible: string;
  }>({
    name: "",
    email: "",
    password: "",
    rule: "",
    manufacturingPlantNames: [],
    manufacturingPlantNamesMaintenanceSecurity: [],
    zonesMaintenanceSecurity: [],
    zoneNames: [],
    typeResponsible: "",
  });
  const [idCurrent, setIdCurrent] = useState<number>(0);

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

    if (
      form.rule === "Supervisor" &&
      form.typeResponsible &&
      !form.manufacturingPlantNamesMaintenanceSecurity.length
    ) {
      toast.error(
        `Seleccione al menos una planta para ${form.typeResponsible}`
      );
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
      typeResponsible:
        form.rule === "Supervisor" && form.typeResponsible
          ? form.typeResponsible
          : "",
      manufacturingPlantNamesMaintenanceSecurity:
        form.rule === "Supervisor" &&
        form.typeResponsible &&
        form.manufacturingPlantNamesMaintenanceSecurity.length
          ? form.manufacturingPlantNamesMaintenanceSecurity
          : [],
      zonesMaintenanceSecurity:
        form.rule === "Supervisor" &&
        form.typeResponsible &&
        form.zonesMaintenanceSecurity.length
          ? form.zonesMaintenanceSecurity
          : [],
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

      const zonesMaintenanceSecurity =
        data.role === "Supervisor" && data.typeResponsible
          ? data.zonesMaintenanceSecurity.map(
              (zone) => `${zone.manufacturingPlant.name} - ${zone.name}`
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
        typeResponsible: data.typeResponsible,
        zonesMaintenanceSecurity,
        manufacturingPlantNamesMaintenanceSecurity:
          data.manufacturingPlantNamesMaintenanceSecurity.map(
            (plant) => plant.name
          ),
      });
    });
  }, [searchParams]);

  const optionsZones = useMemo(() => {
    if (!form.zoneNames.length) {
      return [];
    }

    const optionsZonesCurrent = form.zoneNames.filter((zone) =>
      form.manufacturingPlantNamesMaintenanceSecurity.includes(
        zone.split(" - ")[0]
      )
    );

    if (
      form.zonesMaintenanceSecurity.length &&
      !optionsZonesCurrent.some((zone) =>
        form.zonesMaintenanceSecurity.includes(zone)
      )
    ) {
      setForm({
        ...form,
        zonesMaintenanceSecurity: [],
      });
    }

    return optionsZonesCurrent;
  }, [
    form.zoneNames,
    form.manufacturingPlantNamesMaintenanceSecurity,
    form.zonesMaintenanceSecurity,
  ]);

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
        <Grid item xs={12} sm={6} md={3}>
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

      {form.rule === "Supervisor" && !!form.manufacturingPlantNames.length && (
        <Grid item xs={12} sm={6} md={3}>
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
      )}

      {form.rule === "Supervisor" &&
        !!form.manufacturingPlantNames.length &&
        !!form.zoneNames.length && (
          <Grid item xs={12} sm={6} md={3}>
            <Paper>
              <FormControl fullWidth>
                <InputLabel id="responsible-select-label">
                  Responsable (opcional)
                </InputLabel>
                <Select
                  labelId="responsible-select-label"
                  id="responsible-select"
                  value={form.typeResponsible}
                  label="Responsable (opcional)"
                  onChange={(e: SelectChangeEvent) =>
                    setForm({
                      ...form,
                      typeResponsible: e.target.value as string,
                    })
                  }
                >
                  <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                  <MenuItem value="Seguridad">Seguridad</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
        )}

      {form.rule === "Supervisor" &&
        !!form.manufacturingPlantNames.length &&
        !!form.typeResponsible && (
          <Grid item xs={12} sm={6} md={3}>
            <Paper>
              <MultiSelectMaintenanceSecurity
                label={form.typeResponsible}
                options={form.manufacturingPlantNames}
                values={form.manufacturingPlantNamesMaintenanceSecurity}
                onChange={(values) => {
                  setForm({
                    ...form,
                    manufacturingPlantNamesMaintenanceSecurity: values,
                  });
                }}
              />
            </Paper>
          </Grid>
        )}

      {form.rule === "Supervisor" &&
        !!form.manufacturingPlantNames.length &&
        !!form.typeResponsible &&
        !!form.manufacturingPlantNamesMaintenanceSecurity.length && (
          <Grid item xs={12} sm={6} md={3}>
            <Paper>
              <MultiSelectZonesMaintenanceSecurity
                label={form.typeResponsible}
                options={optionsZones}
                values={form.zonesMaintenanceSecurity}
                onChange={(values) => {
                  setForm({
                    ...form,
                    zonesMaintenanceSecurity: values,
                  });
                }}
              />
            </Paper>
          </Grid>
        )}

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

export default UsersFormPage;
