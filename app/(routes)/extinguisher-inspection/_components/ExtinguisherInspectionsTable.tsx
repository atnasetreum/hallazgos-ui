import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";

import { stringToDate, stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { ExtinguisherInspection } from "@interfaces";

interface Props {
  rows: ExtinguisherInspection[];
}

const columns = [
  "ID",
  "Planta",
  "Responsable",
  "Fecha inspección",
  "Evaluaciones",
  "Creación",
  "Creado por",
  "Acciones",
];

export default function ExtinguisherInspectionsTable({ rows }: Props) {
  return (
    <TableDefault
      rows={rows}
      columns={columns}
      paintRows={(row: ExtinguisherInspection) => (
        <StyledTableRow key={row.id} hover>
          <StyledTableCell>{row.id}</StyledTableCell>
          <StyledTableCell>
            {row.manufacturingPlant?.name || "-"}
          </StyledTableCell>
          <StyledTableCell>{row.responsible?.name || "-"}</StyledTableCell>
          <StyledTableCell>{stringToDate(row.inspectionDate)}</StyledTableCell>
          <StyledTableCell>{row.evaluations?.length || 0}</StyledTableCell>
          <StyledTableCell>
            {stringToDateWithTime(row.createdAt)}
          </StyledTableCell>
          <StyledTableCell>{row.createdBy?.name || "-"}</StyledTableCell>
          <StyledTableCell>
            <Tooltip title="Descargar Excel">
              <IconButton color="primary">
                <SimCardDownloadIcon />
              </IconButton>
            </Tooltip>
          </StyledTableCell>
        </StyledTableRow>
      )}
    />
  );
}
