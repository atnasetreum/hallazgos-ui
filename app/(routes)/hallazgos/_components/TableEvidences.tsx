import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

import { Chip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Stack } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { durantionToTime, notify, stringToDateWithTime } from "@shared/utils";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import {
  ROLE_ADMINISTRADOR,
  ROLE_SUPERVISOR,
  STATUS_CLOSED,
  STATUS_IN_PROGRESS,
  STATUS_OPEN,
} from "@shared/constants";
import EvidencePreview from "./EvidencePreview";
import CloseEvidence from "./CloseEvidence";
import StartProcessEvidence from "./StartProcessEvidence";
import { useUserSessionStore } from "@store";
import { EvidencesService } from "@services";
import { EvidenceGraphql } from "@hooks";
import TableDefaultServer from "@shared/components/TableDefaultServer";
import {
  formatDayLabel,
  getPriorityLabel,
  getRemainingDays,
} from "@routes/hallazgos/_constants/priorityOptions";

const columns = [
  "ID",
  "Planta",
  "Grupo",
  "Tipo de hallazgo",
  "Lugar",
  "Processo",
  "Creado por",
  "Supervisores",
  "Responsables",
  "Estatus",
  "Prioridad",
  "Tiempo restante (días)",
  "Creación",
  "Ultima actualización",
  "Fecha de cierre",
  "Acciones",
];

interface Props {
  rows: EvidenceGraphql[];
  getData: () => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  countEvidence: number;
}

export default function TableEvidences({
  rows,
  getData,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  countEvidence,
}: Props) {
  const [evidenceCurrent, setEvidenceCurrent] =
    useState<EvidenceGraphql | null>(null);
  const [idRow, setIdRow] = useState<number>(0);
  const [idRowProcess, setIdRowProcess] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [supervisorOverrideEmails, setSupervisorOverrideEmails] = useState<
    string[]
  >([]);
  const [cancelEvidenceEmails, setCancelEvidenceEmails] = useState<string[]>(
    [],
  );
  const { id: userId, role, email } = useUserSessionStore();

  useEffect(() => {
    EvidencesService.getPermissionsConfig()
      .then((config) => {
        setSupervisorOverrideEmails(config.supervisorOverrideEmails || []);
        setCancelEvidenceEmails(config.cancelEvidenceEmails || []);
      })
      .catch(() => {
        setSupervisorOverrideEmails([]);
        setCancelEvidenceEmails([]);
      });
  }, []);

  const removeEvicence = (id: number) => {
    setIsLoading(true);
    EvidencesService.remove(id)
      .then(() => {
        notify("Hallazgo eliminado correctamente", true);
        getData();
      })
      .finally(() => setIsLoading(false));
  };

  const confirmRemoveEvidence = (row: EvidenceGraphql) => {
    toast.warning("Confirmar cancelación", {
      description: `¿Desea cancelar/eliminar el hallazgo #${row.id}?`,
      duration: 10000,
      cancel: {
        label: "Cancelar",
        onClick: () => undefined,
      },
      action: {
        label: "Cancelar",
        onClick: () => removeEvicence(row.id),
      },
    });
  };

  // !Atention: Force close evidence if the user is a supervisor
  const validateSupervisor = (row: EvidenceGraphql) => {
    if (supervisorOverrideEmails.includes(email)) {
      return true;
    }
    return (
      row.status === STATUS_OPEN &&
      role === ROLE_SUPERVISOR &&
      (row.supervisors
        .map((supervisor) => Number(supervisor.id))
        .includes(userId) ||
        row.responsibles
          .map((responsible) => Number(responsible.id))
          .includes(userId))
    );
  };

  return (
    <>
      {idRow ? (
        <CloseEvidence
          evidenceCurrent={evidenceCurrent}
          isOpen={!!idRow}
          handleClose={(refresh) => {
            if (refresh) {
              getData();
            }
            setIdRow(0);
            setEvidenceCurrent(null);
          }}
          idRow={idRow}
        />
      ) : (
        <EvidencePreview
          evidenceCurrent={evidenceCurrent}
          handleClose={(refreshData) => {
            if (refreshData) {
              getData();
            }
            setEvidenceCurrent(null);
          }}
        />
      )}

      <StartProcessEvidence
        isOpen={!!idRowProcess}
        idRow={idRowProcess}
        handleClose={(refresh) => {
          if (refresh) {
            getData();
          }
          setIdRowProcess(0);
        }}
      />

      <TableDefaultServer
        rows={rows}
        columns={columns}
        paintRows={(row: EvidenceGraphql) => (
          <StyledTableRow key={row.id}>
            <StyledTableCell
              component="th"
              scope="row"
              sx={{
                width: 70,
                minWidth: 70,
                maxWidth: 70,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.id}
            </StyledTableCell>
            <StyledTableCell
              sx={{
                width: 100,
                minWidth: 100,
                maxWidth: 100,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={row.manufacturingPlant.name}
            >
              {row.manufacturingPlant.name}
            </StyledTableCell>
            <StyledTableCell>{row.mainType.name}</StyledTableCell>
            <StyledTableCell>{row.secondaryType.name}</StyledTableCell>
            <StyledTableCell>{row.zone.name}</StyledTableCell>
            <StyledTableCell
              sx={{
                width: 100,
                minWidth: 100,
                maxWidth: 100,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.process?.name}
            </StyledTableCell>
            <StyledTableCell>{row.user.name}</StyledTableCell>
            <StyledTableCell>
              {row.supervisors
                .map((supervisor) => supervisor.name)
                .join(", ")
                .substring(0, 50)}
              ...
            </StyledTableCell>
            <StyledTableCell>
              {row.responsibles
                .map((responsible) => responsible.name)
                .join(", ")}
            </StyledTableCell>
            <StyledTableCell>
              <Chip
                icon={
                  row.status === STATUS_OPEN ? (
                    <HourglassEmptyIcon />
                  ) : row.status === STATUS_CLOSED ? (
                    <CheckCircleOutlineIcon />
                  ) : row.status === STATUS_IN_PROGRESS ? (
                    <PendingActionsIcon />
                  ) : (
                    <CancelOutlinedIcon />
                  )
                }
                label={row.status}
                color={
                  row.status === STATUS_OPEN
                    ? "warning"
                    : row.status === STATUS_CLOSED
                      ? "success"
                      : row.status === STATUS_IN_PROGRESS
                        ? "info"
                        : "error"
                }
              />
            </StyledTableCell>
            <StyledTableCell>
              {getPriorityLabel(row.priorityDays)}
            </StyledTableCell>
            <StyledTableCell>
              {(() => {
                const remainingDays = getRemainingDays(
                  row.createdAt,
                  row.priorityDays,
                );
                const remainingDaysNumber = Number(remainingDays);

                if (
                  remainingDays !== "N/A" &&
                  !Number.isNaN(remainingDaysNumber) &&
                  remainingDaysNumber < 0
                ) {
                  return (
                    <Chip
                      label={formatDayLabel(remainingDaysNumber)}
                      color="error"
                      size="small"
                    />
                  );
                }

                if (
                  remainingDays !== "N/A" &&
                  !Number.isNaN(remainingDaysNumber)
                ) {
                  return formatDayLabel(remainingDaysNumber);
                }

                return remainingDays;
              })()}
            </StyledTableCell>
            <StyledTableCell>
              {stringToDateWithTime(row.createdAt)}
            </StyledTableCell>
            <StyledTableCell>
              {stringToDateWithTime(row.updatedAt)}
            </StyledTableCell>
            <StyledTableCell>
              {row.solutionDate && stringToDateWithTime(row.solutionDate)}
            </StyledTableCell>
            <StyledTableCell>
              <Stack
                direction="column"
                spacing={1}
                sx={{ alignItems: "flex-start" }}
              >
                <Chip
                  icon={<InfoIcon />}
                  label={`Detalles ${durantionToTime(row)}`}
                  color="secondary"
                  onClick={() => setEvidenceCurrent(row)}
                />
                {(role === ROLE_ADMINISTRADOR || validateSupervisor(row)) &&
                  row.status === STATUS_OPEN &&
                  !row.imgProcess && (
                    <Chip
                      icon={<PlayCircleOutlineIcon />}
                      label="En progreso"
                      color="info"
                      onClick={() => setIdRowProcess(row.id)}
                    />
                  )}
                {validateSupervisor(row) && row.status !== STATUS_CLOSED && (
                  <Chip
                    icon={<AddAPhotoIcon />}
                    label="Cerrar hallazgo"
                    color="warning"
                    onClick={() => {
                      setIdRow(row.id);
                      setEvidenceCurrent(row);
                    }}
                  />
                )}

                {row.status === STATUS_OPEN &&
                  (role === ROLE_ADMINISTRADOR ||
                    cancelEvidenceEmails.includes(email)) && (
                    //&& role === ROLE_ADMINISTRADOR
                    <Chip
                      icon={<DeleteIcon />}
                      label="Cancelar"
                      color="error"
                      onClick={() => confirmRemoveEvidence(row)}
                      disabled={isLoading}
                    />
                  )}
              </Stack>
            </StyledTableCell>
          </StyledTableRow>
        )}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        count={countEvidence}
      />
    </>
  );
}
