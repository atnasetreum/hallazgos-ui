import { stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { ManufacturingPlant } from "@interfaces";

interface Props {
  rows: ManufacturingPlant[];
  getData: () => void;
}

const columns = [
  "ID",
  "Nombre",
  "Latitud",
  "Longitud",
  "Link",
  "Creación",
  "Ultima actualización",
];

export default function TableManufacturingPlants({ rows, getData }: Props) {
  return (
    <TableDefault
      rows={rows}
      columns={columns}
      paintRows={(row: ManufacturingPlant) => (
        <StyledTableRow key={row.id}>
          <StyledTableCell component="th" scope="row">
            {row.id}
          </StyledTableCell>
          <StyledTableCell>{row.name}</StyledTableCell>
          <StyledTableCell>{row.lat}</StyledTableCell>
          <StyledTableCell>{row.lng}</StyledTableCell>
          <StyledTableCell>
            <a href={row.link} target="_blank" rel="noreferrer">
              {row.link}
            </a>
          </StyledTableCell>
          <StyledTableCell>
            {stringToDateWithTime(row.createdAt)}
          </StyledTableCell>
          <StyledTableCell>
            {stringToDateWithTime(row.updatedAt)}
          </StyledTableCell>
        </StyledTableRow>
      )}
    />
  );
}
