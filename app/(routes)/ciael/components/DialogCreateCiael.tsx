import { useEffect, useState } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { SelectChangeEvent } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { toast } from "sonner";
import dayjs, { Dayjs } from "dayjs";

import { AssociatedTasksService } from "_services/associated-tasks.service";
import { Transition } from "@routes/hallazgos/_components/EvidencePreview";
import { TypeOfLinksService } from "_services/type-of-links.service";
import SelectDefault from "@components/SelectDefault";
import { useUserSessionStore } from "@store";
import {
  AccidentPosition,
  AssociatedTask,
  AtAgent,
  AtMechanism,
  BodyPart,
  CieDiagnosis,
  Employee,
  Machine,
  NatureOfEvent,
  RiskFactor,
  TypeOfEvent,
  TypeOfInjury,
  TypeOfLink,
  User,
  WorkingDay,
  Zone,
} from "@interfaces";
import {
  AccidentPositionsService,
  AtAgentsService,
  AtMechanismsService,
  BodyPartsService,
  CiaelsService,
  CieDiagnosesService,
  EmployeesService,
  MachinesService,
  NatureOfEventsService,
  RiskFactorsService,
  TypeOfInjuriesService,
  TypesOfEventsService,
  UsersService,
  WorkingDaysService,
  ZonesService,
} from "@services";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  getData: () => void;
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
  workingDay: string;
  timeWorked: string;
  usualWork: string;
  typeOfLink: string;
  isDeath: string;
  machine: string;
  isInside: string;
  associatedTask: string;
  areaLeader: string;
  riskFactor: string;
  natureOfEvent: string;
  manager: string;
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
  workingDay: "",
  timeWorked: "",
  usualWork: "",
  typeOfLink: "",
  isDeath: "",
  machine: "",
  isInside: "",
  associatedTask: "",
  areaLeader: "",
  riskFactor: "",
  natureOfEvent: "",
  manager: "",
};

const trueFalseOptions = [
  {
    id: "1",
    name: "Si",
  },
  { id: "0", name: "No" },
];

export default function DialogCreateCiael({ open, setOpen, getData }: Props) {
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
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);
  const [typesOfLinks, setTypesOfLinks] = useState<TypeOfLink[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [associatedTasks, setAssociatedTasks] = useState<AssociatedTask[]>([]);
  const [areaLeaders, setAreaLeaders] = useState<User[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [natureOfEvents, setNatureOfEvents] = useState<NatureOfEvent[]>([]);
  const [managersOnDuty, setManagersOnDuty] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    WorkingDaysService.findAll().then(setWorkingDays);
    TypeOfLinksService.findAll().then(setTypesOfLinks);
    RiskFactorsService.findAll().then(setRiskFactors);
    NatureOfEventsService.findAll().then(setNatureOfEvents);
    UsersService.findAll({}).then((users) =>
      setManagersOnDuty(users.sort((a, b) => a.name.localeCompare(b.name)))
    );
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
      MachinesService.findAll({ manufacturingPlantId }).then(setMachines);
      AssociatedTasksService.findAll({ manufacturingPlantId }).then(
        setAssociatedTasks
      );
    }
  }, [form.manufacturingPlant]);

  useEffect(() => {
    if (form.zone) {
      const zoneId = form.zone;
      UsersService.findAll({ zoneId }).then(setAreaLeaders);
    }
  }, [form.zone]);

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
    const name = event.target.name;
    const sanitized = value.replace(/[^0-9]/g, "");
    if (sanitized !== "" && parseInt(sanitized, 10) < 1) {
      setForm({ ...form, [name]: "" });
    } else {
      setForm({ ...form, [name]: sanitized });
    }
  };

  const onChangeSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const saveCiael = () => {
    const {
      manufacturingPlant,
      typeOfEvent,
      cieDiagnosis,
      employee,
      eventDate,
      description,
      daysOfDisability,
      zone,
      accidentPosition,
      bodyPart,
      atAgent,
      typeOfInjury,
      atMechanism,
      workingDay,
      timeWorked,
      usualWork,
      typeOfLink,
      isDeath,
      machine,
      isInside,
      associatedTask,
      areaLeader,
      riskFactor,
      natureOfEvent,
      manager,
    } = form;

    const descriptionClean = description.trim();

    if (!manufacturingPlant) {
      toast.error("Seleccione una planta");
      return;
    }

    if (!typeOfEvent) {
      toast.error("Seleccione un tipo de evento");
      return;
    }

    if (!cieDiagnosis) {
      toast.error("Seleccione un diagnóstico CIE");
      return;
    }

    if (!employee) {
      toast.error("Seleccione un colaborador");
      return;
    }

    if (!eventDate) {
      toast.error("Seleccione la fecha del evento");
      return;
    }

    if (!descriptionClean) {
      toast.error("Ingrese la descripción del evento");
      return;
    }

    if (!zone) {
      toast.error("Seleccione una zona");
      return;
    }

    if (!accidentPosition) {
      toast.error("Seleccione un nombre del cargo");
      return;
    }

    if (!bodyPart) {
      toast.error("Seleccione una parte del cuerpo afectada");
      return;
    }

    if (!atAgent) {
      toast.error("Seleccione un agente AT");
      return;
    }

    if (!typeOfInjury) {
      toast.error("Seleccione un tipo de lesión");
      return;
    }

    if (!atMechanism) {
      toast.error("Seleccione un mecanismo o formas del AT");
      return;
    }

    if (!workingDay) {
      toast.error("Seleccione una jornada");
      return;
    }

    if (!timeWorked) {
      toast.error("Ingrese el tiempo laborado previo al AT");
      return;
    }

    if (!usualWork) {
      toast.error("Seleccione si es labor habitual");
      return;
    }

    if (!typeOfLink) {
      toast.error("Seleccione un tipo de vinculación");
      return;
    }

    if (!isDeath) {
      toast.error("Seleccione si causo la muerte");
      return;
    }

    if (!machine) {
      toast.error("Seleccione una maquina o equipo");
      return;
    }

    if (!isInside) {
      toast.error("Seleccione si fue dentro de la planta");
      return;
    }

    if (!associatedTask) {
      toast.error("Seleccione una tarea asociada");
      return;
    }

    if (!areaLeader) {
      toast.error("Seleccione un lider de área");
      return;
    }

    if (!riskFactor) {
      toast.error("Seleccione un factor de riesgo asociado");
      return;
    }

    if (!natureOfEvent) {
      toast.error("Seleccione una naturaleza del evento");
      return;
    }

    const payload = {
      manufacturingPlantId: manufacturingPlant,
      typeOfEventId: typeOfEvent,
      description: descriptionClean,
      employeeId: employee,
      eventDate: eventDate.format("YYYY-MM-DD"),
      cieDiagnosisId: cieDiagnosis,
      ...(daysOfDisability && { daysOfDisability }),
      accidentPositionId: accidentPosition,
      zoneId: zone,
      bodyPartId: bodyPart,
      atAgentId: atAgent,
      typeOfInjuryId: typeOfInjury,
      atMechanismId: atMechanism,
      workingDayId: workingDay,
      timeWorked,
      usualWork: usualWork === "1",
      typeOfLinkId: typeOfLink,
      isDeath: isDeath === "1",
      //"machineName": "maquina Test"
      machineId: machine,
      isInside: isInside === "1",
      associatedTaskId: associatedTask,
      areaLeaderId: areaLeader,
      riskFactorId: riskFactor,
      natureOfEventsId: natureOfEvent,
      ...(manager && { managerId: manager }),
    };

    setIsLoading(true);
    CiaelsService.create(payload)
      .then(() => {
        getData();
        toast.success("CIAEL creado con éxito");
        handleClose();
      })
      .finally(() => setIsLoading(false));
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
          <Button
            autoFocus
            color="inherit"
            onClick={saveCiael}
            disabled={isLoading}
          >
            Guardar
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ p: 5 }}>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={manufacturingPlants}
            label="Planta *"
            value={form.manufacturingPlant}
            onChange={onChangeSelect}
            name="manufacturingPlant"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={employees}
            label="Colaborador *"
            value={form.employee}
            onChange={onChangeSelect}
            name="employee"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={typesOfEvents}
            label="Tipo de evento *"
            value={form.typeOfEvent}
            onChange={onChangeSelect}
            name="typeOfEvent"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Paper>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha del evento *"
                format="DD/MM/YYYY"
                maxDate={dayjs()}
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
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={cieDiagnoses}
            label="Diagnóstico CIE *"
            value={form.cieDiagnosis}
            onChange={onChangeSelect}
            name="cieDiagnosis"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Paper>
            <TextField
              label="Días de incapacidad"
              variant="outlined"
              fullWidth
              autoComplete="off"
              type="text"
              onKeyDown={handleKeyDown}
              value={form.daysOfDisability}
              name="daysOfDisability"
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={zones}
            label="Zona *"
            value={form.zone}
            onChange={onChangeSelect}
            name="zone"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={accidentPositions}
            label="Nombre del cargo *"
            value={form.accidentPosition}
            onChange={onChangeSelect}
            name="accidentPosition"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={bodyParts}
            label="Parte del cuerpo afectada *"
            value={form.bodyPart}
            onChange={onChangeSelect}
            name="bodyPart"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={atAgents}
            label="Agente AT *"
            value={form.atAgent}
            onChange={onChangeSelect}
            name="atAgent"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={typeOfInjuries}
            label="Tipo de lesión *"
            value={form.typeOfInjury}
            onChange={onChangeSelect}
            name="typeOfInjury"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={atMechanisms}
            label="Mécanismo o formas del AT *"
            value={form.atMechanism}
            onChange={onChangeSelect}
            name="atMechanism"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={workingDays}
            label="Jornada *"
            value={form.workingDay}
            onChange={onChangeSelect}
            name="workingDay"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Paper>
            <TextField
              label="Tiempo laborado previo al AT (H) *"
              variant="outlined"
              fullWidth
              autoComplete="off"
              type="text"
              onKeyDown={handleKeyDown}
              value={form.timeWorked}
              name="timeWorked"
              onChange={handleChange}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={trueFalseOptions}
            label="Labor habitual *"
            value={form.usualWork}
            onChange={onChangeSelect}
            name="usualWork"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={typesOfLinks}
            label="Tipo de vinculación *"
            value={form.typeOfLink}
            onChange={onChangeSelect}
            name="typeOfLink"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={trueFalseOptions}
            label="Muerte *"
            value={form.isDeath}
            onChange={onChangeSelect}
            name="isDeath"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={machines}
            label="Maquina / Equipo *"
            value={form.machine}
            onChange={onChangeSelect}
            name="machine"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={trueFalseOptions}
            label="Dentro de la empresa *"
            value={form.isInside}
            onChange={onChangeSelect}
            name="isInside"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={associatedTasks}
            label="Tarea asociada *"
            value={form.associatedTask}
            onChange={onChangeSelect}
            name="associatedTask"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={areaLeaders}
            label="Lider de área *"
            value={form.areaLeader}
            onChange={onChangeSelect}
            name="areaLeader"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={riskFactors}
            label="Factor de riesgo  asociado *"
            value={form.riskFactor}
            onChange={onChangeSelect}
            name="riskFactor"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={natureOfEvents}
            label="Naturaleza del evento *"
            value={form.natureOfEvent}
            onChange={onChangeSelect}
            name="natureOfEvent"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SelectDefault
            data={managersOnDuty}
            label="Gestor en turno"
            value={form.manager}
            onChange={onChangeSelect}
            name="manager"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Paper sx={{ p: 2 }}>
            <TextField
              id="description-multiline-solution"
              multiline
              rows={10}
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
