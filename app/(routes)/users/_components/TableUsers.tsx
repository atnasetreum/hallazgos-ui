import { useState } from "react";

import { useRouter } from "next/navigation";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

import { notify, stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { User } from "@interfaces";
import { UsersService } from "@services";

interface Props {
  rows: User[];
  getData: () => void;
}

const columns = [
  "ID",
  "Nombre",
  "Correo electrónico",
  "Plantas",
  "Zonas",
  "Role",
  "Responsable",
  "Plantas responsables",
  "Zonas responsables",
  "Creación",
  "Ultima actualización",
  "Acciones",
];

export default function TableUsers({ rows, getData }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const remove = (id: number) => {
    setIsLoading(true);
    UsersService.remove(id)
      .then(() => {
        notify("Planta eliminada correctamente", true);
        getData();
      })
      .finally(() => setIsLoading(false));
  };

  const truncateText = (text: string) => {
    if (!text) return "";

    const size = 50;

    return `${text.substring(0, size)} ${text.length > size ? "..." : ""}`;
  };

  return (
    <TableDefault
      rows={rows}
      columns={columns}
      paintRows={(row: User) => {
        const zonesName = row.zones
          .map(
            ({ name, manufacturingPlant }) =>
              `${name} (${manufacturingPlant.name})`
          )
          .join(", ");

        const zonesMaintenanceSecurityName = row.zonesMaintenanceSecurity
          .map(
            ({ name, manufacturingPlant }) =>
              `${name} (${manufacturingPlant.name})`
          )
          .join(", ");

        return (
          <StyledTableRow key={row.id}>
            <StyledTableCell component="th" scope="row">
              {row.id}
            </StyledTableCell>
            <StyledTableCell>{row.name}</StyledTableCell>
            <StyledTableCell>{row.email}</StyledTableCell>
            <StyledTableCell>
              {row.manufacturingPlants.map(({ name }) => name).join(", ")}
            </StyledTableCell>
            <StyledTableCell>
              <Tooltip title={zonesName}>
                <div>{truncateText(zonesName)}</div>
              </Tooltip>
            </StyledTableCell>
            <StyledTableCell>{row.role}</StyledTableCell>
            <StyledTableCell>{row.typeResponsible}</StyledTableCell>
            <StyledTableCell>
              {row.manufacturingPlantNamesMaintenanceSecurity
                .map(({ name }) => name)
                .join(", ")}
            </StyledTableCell>
            <StyledTableCell>
              <Tooltip title={zonesMaintenanceSecurityName}>
                <div>{truncateText(zonesMaintenanceSecurityName)}</div>
              </Tooltip>
            </StyledTableCell>
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
            </StyledTableCell>
          </StyledTableRow>
        );
      }}
    />
  );
}
