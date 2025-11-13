import { stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { Employee } from "@interfaces";

interface Props {
  rows: Employee[];
  getData: () => void;
}

const columns = ["Código", "Nombre", "Fecha de admisión"];

export default function TableEmployees({ rows }: Props) {
  return (
    <TableDefault
      rows={rows}
      columns={columns}
      paintRows={(row: Employee) => {
        /* const zonesName = row.zones
          .map(
            ({ name, manufacturingPlant }) =>
              `${name} (${manufacturingPlant.name})`
          )
          .join("\n");

        const processesName = row.processes
          .map(
            ({ name, manufacturingPlant }) =>
              `${name} (${manufacturingPlant.name})`
          )
          .join("\n"); */

        return (
          <StyledTableRow key={row.id}>
            <StyledTableCell component="th" scope="row">
              {row.code}
            </StyledTableCell>
            <StyledTableCell>{row.name}</StyledTableCell>
            <StyledTableCell>
              {stringToDateWithTime(row.dateOfAdmission || "")}
            </StyledTableCell>
            {/* 
            <StyledTableCell>{row.email}</StyledTableCell>
            <StyledTableCell>
              {row.manufacturingPlants.map(({ name }) => name).join(", ")}
            </StyledTableCell>
            <StyledTableCell>
              <Tooltip title={zonesName}>
                <div>{truncateText(zonesName)}</div>
              </Tooltip>
            </StyledTableCell>
            <StyledTableCell>
              <Tooltip title={processesName}>
                <div>{truncateText(processesName)}</div>
              </Tooltip>
            </StyledTableCell>
            <StyledTableCell>{row.role}</StyledTableCell>
            <StyledTableCell>
              {stringToDateWithTime(row.createdAt)}
            </StyledTableCell>
            <StyledTableCell>
              {stringToDateWithTime(row.updatedAt)}
            </StyledTableCell>
            <StyledTableCell>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<EditIcon />}
                  label="Editar"
                  color="warning"
                  onClick={() => router.push("/users/form?id=" + row.id)}
                />
                <Chip
                  icon={<DeleteIcon />}
                  label="Cancelar"
                  color="error"
                  onClick={() => remove(row.id)}
                  disabled={isLoading}
                />
              </Stack>
            </StyledTableCell> */}
          </StyledTableRow>
        );
      }}
    />
  );
}
