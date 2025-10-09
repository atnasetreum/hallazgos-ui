import { useEffect, useState } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Dayjs } from "dayjs";

import { Transition } from "@routes/hallazgos/_components/EvidencePreview";
import SelectDefault from "@components/SelectDefault";
import { useUserSessionStore } from "@store";
import {
  AccidentPosition,
  AtAgent,
  AtMechanism,
  BodyPart,
  CieDiagnosis,
  Employee,
  TypeOfEvent,
  TypeOfInjury,
  Zone,
} from "@interfaces";
import {
  AccidentPositionsService,
  AtAgentsService,
  AtMechanismsService,
  BodyPartsService,
  CieDiagnosesService,
  EmployeesService,
  TypeOfInjuriesService,
  TypesOfEventsService,
  ZonesService,
} from "@services";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface FormProps {
  manufacturingPlant: string;
  typeOfEvent: string;
  cieDiagnosis: string;
  employee: string;
  eventDate: Dayjs | null;
  description: string;
  daysOfDisability: string;
  zone: string;
  accidentPosition: string;
  bodyPart: string;
  atAgent: string;
  typeOfInjury: string;
  atMechanism: string;
}

const initialForm: FormProps = {
  manufacturingPlant: "",
  typeOfEvent: "",
  cieDiagnosis: "",
  employee: "",
  eventDate: null,
  description: "",
  daysOfDisability: "",
  zone: "",
  accidentPosition: "",
  bodyPart: "",
  atAgent: "",
  typeOfInjury: "",
  atMechanism: "",
};

export default function DialogCreateCiael({ open, setOpen }: Props) {
  const [typesOfEvents, setTypesOfEvents] = useState<TypeOfEvent[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [cieDiagnoses, setCieDiagnoses] = useState<CieDiagnosis[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  const [atAgents, setAtAgents] = useState<AtAgent[]>([]);
  const [accidentPositions, setAccidentPositions] = useState<
    AccidentPosition[]
  >([]);
  const [typeOfInjuries, setTypeOfInjuries] = useState<TypeOfInjury[]>([]);
  const [atMechanisms, setAtMechanisms] = useState<AtMechanism[]>([]);

  const [form, setForm] = useState<FormProps>(initialForm);

  const resetForm = () => setForm(initialForm);

  const manufacturingPlants = useUserSessionStore(
    (state) => state.manufacturingPlants
  );

  useEffect(() => {
    TypesOfEventsService.findAll().then(setTypesOfEvents);
    CieDiagnosesService.findAll().then(setCieDiagnoses);
    BodyPartsService.findAll().then(setBodyParts);
    AtAgentsService.findAll().then(setAtAgents);
    TypeOfInjuriesService.findAll().then(setTypeOfInjuries);
    AtMechanismsService.findAll().then(setAtMechanisms);
  }, []);

  useEffect(() => {
    if (form.manufacturingPlant) {
      const manufacturingPlantId = form.manufacturingPlant;

      EmployeesService.findAll({
        manufacturingPlantId: Number(manufacturingPlantId),
      }).then(setEmployees);

      ZonesService.findAll({ manufacturingPlantId }).then(setZones);

      AccidentPositionsService.findAll({ manufacturingPlantId }).then(
        setAccidentPositions
      );
    }
  }, [form.manufacturingPlant]);

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const blockedKeys = ["e", "E", "+", "-", "."];
    if (blockedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const sanitized = value.replace(/[^0-9]/g, "");
    if (sanitized !== "" && parseInt(sanitized, 10) < 1) {
      setForm({ ...form, daysOfDisability: "" });
    } else {
      setForm({ ...form, daysOfDisability: sanitized });
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            CIAEL
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Guardar
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ p: 5 }}>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={manufacturingPlants}
            label="Planta *"
            value={form.manufacturingPlant}
            onChange={(e) =>
              setForm({
                ...form,
                manufacturingPlant: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={employees}
            label="Colaborador *"
            value={form.employee}
            onChange={(e) => setForm({ ...form, employee: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={typesOfEvents}
            label="Tipo de evento *"
            value={form.typeOfEvent}
            onChange={(e) =>
              setForm({
                ...form,
                typeOfEvent: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <Paper>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha del evento *"
                format="DD/MM/YYYY"
                value={form.eventDate}
                onChange={(newValue: Dayjs | null) =>
                  setForm({ ...form, eventDate: newValue })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                  } as TextFieldProps,
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={cieDiagnoses}
            label="Diagnóstico CIE *"
            value={form.cieDiagnosis}
            onChange={(e) =>
              setForm({
                ...form,
                cieDiagnosis: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <Paper>
            <TextField
              label="Días de incapacidad"
              variant="outlined"
              fullWidth
              autoComplete="off"
              type="text"
              onKeyDown={handleKeyDown}
              value={form.daysOfDisability}
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={zones}
            label="Zona *"
            value={form.zone}
            onChange={(e) =>
              setForm({
                ...form,
                zone: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={accidentPositions}
            label="Nombre del cargo *"
            value={form.accidentPosition}
            onChange={(e) =>
              setForm({
                ...form,
                accidentPosition: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={bodyParts}
            label="Parte del cuerpo afectada *"
            value={form.bodyPart}
            onChange={(e) =>
              setForm({
                ...form,
                bodyPart: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={atAgents}
            label="Agente AT *"
            value={form.atAgent}
            onChange={(e) =>
              setForm({
                ...form,
                atAgent: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={typeOfInjuries}
            label="Tipo de lesión *"
            value={form.typeOfInjury}
            onChange={(e) =>
              setForm({
                ...form,
                typeOfInjury: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <SelectDefault
            data={atMechanisms}
            label="Mécanismo o formas del AT *"
            value={form.atMechanism}
            onChange={(e) =>
              setForm({
                ...form,
                atMechanism: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper sx={{ p: 2 }}>
            <TextField
              id="description-multiline-solution"
              multiline
              rows={2}
              variant="standard"
              fullWidth
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              label="Descripción del evento"
            />
          </Paper>
        </Grid>
      </Grid>
    </Dialog>
  );
}
