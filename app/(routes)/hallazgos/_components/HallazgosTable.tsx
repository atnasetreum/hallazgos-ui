import { useState } from "react";

import Chip from "@mui/material/Chip";
import InfoIcon from "@mui/icons-material/Info";

import { stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { Evidence } from "@interfaces";
import { STATUS_CLOSED, STATUS_OPEN } from "@shared/constants";
import EvidencePreview from "./EvidencePreview";

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
  "Acciones",
];

export default function HallazgosTable({ rows, getData }: Props) {
  const [evidenceCurrent, setEvidenceCurrent] = useState<Evidence | null>(null);

  return (
    <>
      <EvidencePreview
        evidenceCurrent={evidenceCurrent}
        handleClose={(refresh) => {
          if (refresh) {
            getData();
          }
          setEvidenceCurrent(null);
        }}
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
              <Chip
                icon={<InfoIcon />}
                label="Detalles"
                color="secondary"
                onClick={() => setEvidenceCurrent(row)}
              />
            </StyledTableCell>
          </StyledTableRow>
        )}
      />
    </>
  );
}
