"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import Box from "@mui/material/Box";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useDebouncedCallback } from "use-debounce";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import TablePaginationActions from "@shared/components/TablePaginationActions";
import { Transition } from "@routes/hallazgos/_components/EvidencePreview";
import LoadingLinear from "@shared/components/LoadingLinear";
import SelectDefault from "@components/SelectDefault";
import { stringToDateWithTime } from "@shared/utils";
import { useUserSessionStore } from "@store";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import {
  ConfigTgService,
  EmployeesService,
  TopicsService,
  UsersService,
} from "@services";
import {
  BasicData,
  ConfigTg,
  ManufacturingPlant,
  Topic,
  User,
} from "@interfaces";

export interface IFiltersConfigTg {
  manufacturingPlantId?: number;
  positionId?: number;
}

const colSpan = 11;

const ScreenForm = ({
  manufacturingPlants,
  positions,
  currentId,
  closeDialog,
}: {
  manufacturingPlants: ManufacturingPlant[];
  positions: BasicData[];
  currentId: number;
  closeDialog: () => void;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState<string>("");
  const [currentEmployees, setCurrentEmployees] = useState<string[]>([]);

  const [form, setForm] = useState<{
    positionId: string;
    manufacturingPlantId: string;
    areaManagerId: string;
    humanResourceManagerId: string;
    topics: {
      id: number;
      topic: Topic;
      responsibles: User[];
    }[];
  }>({
    positionId: "",
    manufacturingPlantId: "",
    areaManagerId: "",
    humanResourceManagerId: "",
    topics: [],
  });

  const saveData = () => {
    if (!form.manufacturingPlantId) {
      toast.error("Debe seleccionar una planta");
      return;
    }

    if (!form.positionId) {
      toast.error("Debe seleccionar un puesto");
      return;
    }

    if (!form.areaManagerId) {
      toast.error("Debe seleccionar un jefe de área");
      return;
    }

    if (!form.humanResourceManagerId) {
      toast.error("Debe seleccionar un jefe de RRHH");
      return;
    }

    if (!form.topics.length) {
      toast.error("Debe agregar al menos un tema");
      return;
    }

    const payload = {
      manufacturingPlantId: Number(form.manufacturingPlantId),
      positionId: Number(form.positionId),
      areaManagerId: Number(form.areaManagerId),
      humanResourceManagerId: Number(form.humanResourceManagerId),
      topics: form.topics.map((t) => ({
        id: t.id,
        responsibleIds: t.responsibles.map((r) => r.id),
      })),
    };

    if (!currentId) {
      ConfigTgService.create(payload).then(() => {
        toast.success("Configuración creada correctamente");
        closeDialog();
      });
    } else {
      ConfigTgService.update(currentId, payload).then(() => {
        toast.success("Configuración actualizada correctamente");
        closeDialog();
      });
    }
  };

  const handleClose = (shouldSave: boolean) => {
    if (!shouldSave) {
      closeDialog();
      return;
    }

    saveData();
  };

  const getData = useCallback(() => {
    if (!currentId) return;

    ConfigTgService.findOne(currentId).then((data) => {
      setForm({
        positionId: String(data.position.id),
        manufacturingPlantId: String(data.manufacturingPlant.id),
        areaManagerId: String(data.areaManager.id),
        humanResourceManagerId: String(data.humanResourceManager.id),
        topics: data.topics.map((t) => ({
          id: t.topic.id,
          topic: t.topic,
          responsibles: t.responsibles,
        })),
      });
    });
  }, [currentId]);

  useEffect(() => {
    if (currentId) {
      getData();
    }
  }, [getData, currentId]);

  const manufacturingPlantId = useMemo(() => {
    return Number(form.manufacturingPlantId || 0);
  }, [form]);

  useEffect(() => {
    if (manufacturingPlantId) {
      UsersService.findAll({
        manufacturingPlantId: manufacturingPlantId.toString(),
      }).then(setUsers);
      TopicsService.findAll({ manufacturingPlantId }).then(setTopics);
      if (!currentId) {
        setForm((prev) => ({
          ...prev,
          areaManagerId: "",
          humanResourceManagerId: "",
          topics: [],
        }));
      }
    }
  }, [manufacturingPlantId, currentId]);

  return (
    <Dialog
      fullScreen
      open={true}
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
            {!currentId ? "Nuevo" : "Editar"}
          </Typography>
          <Button autoFocus color="inherit" onClick={() => handleClose(true)}>
            Guardar
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} sm={12} md={12}>
          <SelectDefault
            data={manufacturingPlants}
            label="Planta"
            value={form.manufacturingPlantId}
            onChange={(e) => {
              setForm({
                ...form,
                manufacturingPlantId: e.target.value,
              });
            }}
          />
        </Grid>
        {!!manufacturingPlantId && (
          <>
            <Grid item xs={12} sm={12} md={12}>
              <SelectDefault
                data={positions}
                label="Puesto"
                value={form.positionId}
                onChange={(e) => {
                  setForm({
                    ...form,
                    positionId: e.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <SelectDefault
                data={users}
                label="Jefe de área"
                value={form.areaManagerId}
                onChange={(e) => {
                  setForm({
                    ...form,
                    areaManagerId: e.target.value,
                  });
                }}
                validationEmpty={!users.length ? true : false}
                helperText={
                  !users.length
                    ? "No hay colaboradores disponibles para la planta seleccionada"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <SelectDefault
                data={users}
                label="Jefe de RRHH"
                value={form.humanResourceManagerId}
                onChange={(e) => {
                  setForm({
                    ...form,
                    humanResourceManagerId: e.target.value,
                  });
                }}
                validationEmpty={!users.length ? true : false}
                helperText={
                  !users.length
                    ? "No hay colaboradores disponibles para la planta seleccionada"
                    : ""
                }
              />
            </Grid>
            <Paper sx={{ p: 2, width: "100%", m: 3 }} elevation={3}>
              <Grid item xs={12} sm={12} md={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <SelectDefault
                      data={topics.map((topic) => ({
                        ...topic,
                        name:
                          topic.name.slice(0, 70) +
                          (topic.name.length > 70 ? "..." : ""),
                      }))}
                      label="Temas"
                      value={topicId}
                      onChange={(e) => setTopicId(e.target.value)}
                      validationEmpty={!topics.length ? true : false}
                      helperText={
                        !topics.length
                          ? "No hay temas disponibles para la planta seleccionada"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    {!!users.length ? (
                      <Paper>
                        <Autocomplete
                          multiple
                          options={users}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          renderOption={(props, option, { selected }) => {
                            const { key, ...optionProps } = props;
                            return (
                              <li key={key} {...optionProps}>
                                <Checkbox
                                  icon={
                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                  }
                                  checkedIcon={
                                    <CheckBoxIcon fontSize="small" />
                                  }
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                />
                                {option.name}
                              </li>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Responsables" />
                          )}
                          value={users.filter((emp) =>
                            currentEmployees.includes(String(emp.id)),
                          )}
                          onChange={(_, newValue) => {
                            setCurrentEmployees(
                              newValue.map((emp) => String(emp.id)),
                            );
                          }}
                        />
                      </Paper>
                    ) : (
                      <p>
                        No hay colaboradores disponibles para la planta
                        seleccionada
                      </p>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={!topicId || !currentEmployees.length}
                      onClick={() => {
                        const topicExists = form.topics.find(
                          (t) => t.id === Number(topicId),
                        );
                        if (topicExists) {
                          toast.error("El tema ya ha sido agregado");
                          return;
                        }
                        setForm({
                          ...form,
                          topics: [
                            ...form.topics,
                            {
                              id: Number(topicId),
                              topic: topics.find(
                                (t) => t.id === Number(topicId),
                              )!,
                              responsibles: users.filter((emp) =>
                                currentEmployees.includes(String(emp.id)),
                              ),
                            },
                          ],
                        });
                        setTopicId("");
                        setCurrentEmployees([]);
                      }}
                    >
                      Agregar tema
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell>Orden</StyledTableCell>
                            <StyledTableCell>Tema</StyledTableCell>
                            <StyledTableCell>Responsables</StyledTableCell>
                            <StyledTableCell>Eliminar</StyledTableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          {form.topics.map((row, idx) => (
                            <StyledTableRow
                              key={row.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <StyledTableCell component="th" scope="row">
                                {idx + 1}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.topic.name}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.responsibles
                                  .map((resp) => resp.name)
                                  .join(", ")}
                              </StyledTableCell>
                              <StyledTableCell>
                                <Tooltip title="Eliminar" placement="top">
                                  <Button
                                    startIcon={<DeleteIcon color="error" />}
                                    onClick={() =>
                                      setForm({
                                        ...form,
                                        topics: form.topics.filter(
                                          (t) => t.id !== row.id,
                                        ),
                                      })
                                    }
                                  />
                                </Tooltip>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </Grid>
    </Dialog>
  );
};

export default function TopicTg() {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [rows, setRows] = useState<ConfigTg[]>([]);
  const [positions, setPositions] = useState<BasicData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentId, setCurrentId] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<{
    manufacturingPlantId: string;
    positionId: string;
  }>({
    manufacturingPlantId: "",
    positionId: "",
  });

  const getData = useDebouncedCallback(() => {
    setIsLoading(true);
    ConfigTgService.findAll({
      manufacturingPlantId: Number(filters.manufacturingPlantId || 0),
      positionId: Number(filters.positionId || 0),
    })
      .then(setRows)
      .finally(() => setIsLoading(false));
  }, 500);

  useEffect(() => {
    getData();
  }, [getData, filters]);

  useEffect(() => {
    EmployeesService.findPositions().then(setPositions);
  }, []);

  const { manufacturingPlants } = useUserSessionStore((state) => state);

  const theme = useTheme();

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {isOpen && (
        <ScreenForm
          manufacturingPlants={manufacturingPlants}
          positions={positions}
          currentId={currentId}
          closeDialog={() => {
            setIsOpen(false);
            setCurrentId(0);
            getData();
          }}
        />
      )}
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            variant="h4"
            gutterBottom
            color={
              theme.palette.mode === "light"
                ? theme.palette.common.black
                : theme.palette.common.white
            }
          >
            Configuración - Guías de entrenamiento
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                color={
                  theme.palette.mode === "light"
                    ? theme.palette.common.black
                    : theme.palette.common.white
                }
              >
                <FilterListIcon sx={{ pt: 1 }} /> Filters ({rows.length})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2}>
                      <SelectDefault
                        data={manufacturingPlants}
                        label="Planta"
                        isFilter={true}
                        value={filters.manufacturingPlantId}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            manufacturingPlantId: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <SelectDefault
                        data={positions}
                        label="Puesto"
                        isFilter={true}
                        value={filters.positionId}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            positionId: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                >
                  <Tooltip title="Crear" placement="top">
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setIsOpen(true)}
                    />
                  </Tooltip>
                  <Tooltip title="Actualizar" placement="top">
                    <Button
                      variant="contained"
                      startIcon={<RefreshIcon />}
                      onClick={() => getData()}
                    />
                  </Tooltip>
                </ButtonGroup>
              </Toolbar>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          {isLoading ? (
            <LoadingLinear />
          ) : (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="custom pagination table"
              >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Puesto</StyledTableCell>
                    <StyledTableCell>Planta</StyledTableCell>
                    <StyledTableCell>No. Temas</StyledTableCell>
                    <StyledTableCell>Jefe de área</StyledTableCell>
                    <StyledTableCell>Jefe RRHH</StyledTableCell>
                    <StyledTableCell>Fecha de creación</StyledTableCell>
                    <StyledTableCell>Creado por</StyledTableCell>
                    <StyledTableCell>Fecha de actualización</StyledTableCell>
                    <StyledTableCell>Actualizado por</StyledTableCell>
                    <StyledTableCell>Acciones</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                    : rows
                  ).map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.id}
                      </StyledTableCell>
                      <StyledTableCell>{row.position.name}</StyledTableCell>
                      <StyledTableCell>
                        {row.manufacturingPlant.name}
                      </StyledTableCell>
                      <StyledTableCell>{row.topics.length}</StyledTableCell>
                      <StyledTableCell>{row.areaManager.name}</StyledTableCell>
                      <StyledTableCell>
                        {row.humanResourceManager.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        {stringToDateWithTime(row.createdAt)}
                      </StyledTableCell>
                      <StyledTableCell>{row.createdBy.name}</StyledTableCell>
                      <StyledTableCell>
                        {stringToDateWithTime(row.updatedAt)}
                      </StyledTableCell>
                      <StyledTableCell>{row.updatedBy?.name}</StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title="Editar" placement="top">
                          <Button
                            startIcon={<EditIcon color="inherit" />}
                            onClick={() => {
                              setIsOpen(true);
                              setCurrentId(row.id);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Eliminar" placement="top">
                          <Button
                            startIcon={<DeleteIcon color="error" />}
                            onClick={() =>
                              toast("¡ Confirmar eliminación !", {
                                position: "top-center",
                                description: `¿Está seguro de eliminar?`,
                                action: {
                                  label: "Confirmar",
                                  onClick: () =>
                                    ConfigTgService.remove(row.id).then(() => {
                                      toast.success(
                                        "Configuración eliminada correctamente",
                                      );
                                      getData();
                                    }),
                                },
                              })
                            }
                          />
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  {emptyRows > 0 && (
                    <StyledTableRow style={{ height: 53 * emptyRows }}>
                      <StyledTableCell colSpan={colSpan} />
                    </StyledTableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <StyledTableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={colSpan}
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            "aria-label": "rows per page",
                          },
                          native: true,
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </StyledTableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
}
