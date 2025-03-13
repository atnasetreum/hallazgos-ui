import { useState } from "react";

import { useRouter } from "next/navigation";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { notify, stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { SecondaryType } from "@interfaces";
import { SecondaryTypesService } from "@services";

interface Props {
  rows: SecondaryType[];
  getData: () => void;
}

const columns = [
  "ID",
  "Nombre",
  "Criterio",
  "Responsable",
  "Creación",
  "Ultima actualización",
  "Acciones",
];

export default function TableSecondaryTypes({ rows, getData }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const remove = (id: number) => {
    setIsLoading(true);
    SecondaryTypesService.remove(id)
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
      paintRows={(row: SecondaryType) => (
        <StyledTableRow key={row.id}>
          <StyledTableCell component="th" scope="row">
            {row.id}
          </StyledTableCell>
          <StyledTableCell>{row.name}</StyledTableCell>
          <StyledTableCell>{row.mainType.name}</StyledTableCell>
          <StyledTableCell>{row.typeResponsible}</StyledTableCell>
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
                onClick={() =>
                  router.push("/secondary-types/form?id=" + row.id)
                }
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
