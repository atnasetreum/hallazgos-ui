import { useState } from "react";

import Chip from "@mui/material/Chip";
import InfoIcon from "@mui/icons-material/Info";
import Stack from "@mui/material/Stack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";

import { durantionToTime, notify, stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { Evidence } from "@interfaces";
import {
  ROLE_ADMINISTRADOR,
  STATUS_CLOSED,
  STATUS_OPEN,
  ROLE_SUPERVISOR,
} from "@shared/constants";
import EvidencePreview from "./EvidencePreview";
import CloseEvidence from "./CloseEvidence";
import { useUserSessionStore } from "@store";
import { EvidencesService } from "@services";

interface Props {
  rows: Evidence[];
  getData: () => void;
}

const columns = [
  "ID",
  "Planta",
  "Grupo",
  "Tipo de evidencia",
  "Zona",
  "Creado por",
  "Supervisor",
  "Estatus",
  "Creación",
  "Ultima actualización",
  "Fecha de cierre",
  "Acciones",
];

export default function TableEvidences({ rows, getData }: Props) {
  const [evidenceCurrent, setEvidenceCurrent] = useState<Evidence | null>(null);
  const [idRow, setIdRow] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { role, zones } = useUserSessionStore();

  const removeEvicence = (id: number) => {
    setIsLoading(true);
    EvidencesService.remove(id)
      .then(() => {
        notify("Hallazgo eliminado correctamente", true);
        getData();
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <EvidencePreview
        evidenceCurrent={evidenceCurrent}
        handleClose={() => setEvidenceCurrent(null)}
      />
      <CloseEvidence
        isOpen={!!idRow}
        handleClose={(refresh) => {
          if (refresh) {
            getData();
          }
          setIdRow(0);
        }}
        idRow={idRow}
      />
      <TableDefault
        rows={rows}
        columns={columns}
        paintRows={(row: Evidence) => (
          <StyledTableRow key={row.id}>
            <StyledTableCell component="th" scope="row">
              {row.id}
            </StyledTableCell>
            <StyledTableCell>{row.manufacturingPlant.name}</StyledTableCell>
            <StyledTableCell>{row.mainType.name}</StyledTableCell>
            <StyledTableCell>{row.secondaryType.name}</StyledTableCell>
            <StyledTableCell>{row.zone.name}</StyledTableCell>
            <StyledTableCell>{row.user.name}</StyledTableCell>
            <StyledTableCell>{row.supervisor.name}</StyledTableCell>
            <StyledTableCell>
              <Chip
                label={row.status}
                color={
                  row.status === STATUS_OPEN
                    ? "warning"
                    : row.status === STATUS_CLOSED
                    ? "success"
                    : "error"
                }
              />
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
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<InfoIcon />}
                  label={`Detalles ${
                    row.status === STATUS_CLOSED
                      ? durantionToTime(row.createdAt, row.solutionDate)
                      : ""
                  }`}
                  color="secondary"
                  onClick={() => setEvidenceCurrent(row)}
                />
                {row.status === STATUS_OPEN &&
                  role === ROLE_SUPERVISOR &&
                  zones.find((zone) => zone.id === row.zone.id) && (
                    <Chip
                      icon={<AddAPhotoIcon />}
                      label="Cerrar hallazgo"
                      color="warning"
                      onClick={() => setIdRow(row.id)}
                    />
                  )}

                {row.status === STATUS_OPEN && role === ROLE_ADMINISTRADOR && (
                  <Chip
                    icon={<DeleteIcon />}
                    label="Cancelar"
                    color="error"
                    onClick={() => removeEvicence(row.id)}
                    disabled={isLoading}
                  />
                )}
              </Stack>
            </StyledTableCell>
          </StyledTableRow>
        )}
      />
    </>
  );
}
