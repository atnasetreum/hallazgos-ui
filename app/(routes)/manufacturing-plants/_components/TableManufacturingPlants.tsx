import { useState } from "react";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { notify, stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { ManufacturingPlant } from "@interfaces";
import { ManufacturingPlantsService } from "@services";

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
  "Acciones",
];

export default function TableManufacturingPlants({ rows, getData }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const remove = (id: number) => {
    setIsLoading(true);
    ManufacturingPlantsService.remove(id)
      .then(() => {
        notify("Planta eliminada correctamente", true);
        getData();
      })
      .finally(() => setIsLoading(false));
  };

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
          <StyledTableCell>
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<EditIcon />}
                label="Editar"
                color="warning"
                onClick={() => alert()}
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
      )}
    />
  );
}
