import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import { Transition } from "@routes/hallazgos/_components/EvidencePreview";
import { Employee, Equipment, PayloadCreateEpp } from "@interfaces";
import { EmployeesService } from "_services/employees.service";
import SelectDefault from "@components/SelectDefault";
import { EquipmentsService } from "@services";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import DialogSignatureEpp from "./DialogSignatureEpp";

interface Props {
  open: boolean;
  create: (form: PayloadCreateEpp) => void;
}

export default function DialogCreateEpp({ open, create }: Props) {
  const [signature, setSignature] = useState<string>("");
  const [equipmentsNew, setEquipmentsNew] = useState<
    { id: number; name: string; quantity: number; observations: string }[]
  >([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [form, setForm] = useState<{
    employee: string;
    equipment: string;
    observations: string;
  }>({
    employee: "",
    equipment: "",
    observations: "",
  });
  const [openSignature, setOpenSignature] = useState(false);

  useEffect(() => {
    EquipmentsService.findAll().then(setEquipments);
  }, []);

  useEffect(() => {
    EmployeesService.findAll({}).then(setEmployees);
  }, []);

  const isDisabledSave = useMemo(() => {
    const employeeId = Number(form.employee || 0);
    return !!employeeId && !!equipmentsNew.length && !!signature;
  }, [form, equipmentsNew, signature]);

  const handleClose = (save: boolean) => {
    const employeeId = Number(form.employee || 0);

    create(
      save && isDisabledSave
        ? {
            employeeId,
            equipments: equipmentsNew.map(({ id, observations, quantity }) => ({
              id,
              observations,
              quantity,
            })),
            signature,
          }
        : ({} as PayloadCreateEpp)
    );
    setSignature("");
    setEquipmentsNew([]);
    setForm({
      employee: "",
      equipment: "",
      observations: "",
    });
  };

  const handleAddEquipment = () => {
    const { equipment, observations } = form;
    if (equipment) {
      const currentEquipment = equipments.find(
        (eq) => eq.id === Number(equipment)
      );

      if (currentEquipment) {
        setEquipmentsNew([
          ...equipmentsNew,
          {
            id: currentEquipment.id,
            quantity: 1,
            name: currentEquipment.name,
            observations: observations.trim() || "",
          },
        ]);
        setForm({ ...form, equipment: "", observations: "" });
      }
    }
  };

  return (
    <>
      <DialogSignatureEpp
        open={openSignature}
        setOpen={setOpenSignature}
        setSignature={setSignature}
      />
      <Dialog
        fullScreen
        open={open}
        onClose={() => handleClose(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => handleClose(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Epp
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => handleClose(true)}
              disabled={!isDisabledSave}
            >
              Guardar
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2} sx={{ p: 5 }}>
          <Grid item xs={12} md={6} lg={2}>
            <SelectDefault
              data={employees}
              label="Empleado"
              value={form.employee}
              onChange={(e) => setForm({ ...form, employee: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <SelectDefault
              data={equipments.filter(
                (eq) => !equipmentsNew.some((newEq) => newEq.id === eq.id)
              )}
              label="Equipo"
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Paper sx={{ p: 2 }}>
              <TextField
                multiline
                rows={4}
                variant="standard"
                fullWidth
                value={form.observations}
                onChange={(e) =>
                  setForm({ ...form, observations: e.target.value })
                }
                label="Observaciones"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <Stack spacing={2} direction="column">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddEquipment()}
              >
                Agregar
              </Button>
              <Button
                color="secondary"
                variant="contained"
                startIcon={<VerifiedUserIcon />}
                onClick={() => setOpenSignature(true)}
              >
                Firmar
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            {signature ? (
              <Image src={signature} alt="Signature" width={350} height={150} />
            ) : (
              <center>
                <Typography variant="body2" color="text.secondary">
                  No hay firma
                </Typography>
              </center>
            )}
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Equipo</StyledTableCell>
                    <StyledTableCell>Observaciones</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {equipmentsNew.map((equipment) => (
                    <StyledTableRow
                      key={equipment.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {equipment.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        {equipment.observations}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
}
