import { useState } from "react";

import { useRouter } from "next/navigation";

import { Chip } from "@mui/material";
import { Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";

import { notify, stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { Zone } from "@interfaces";
import { ZonesService } from "@services";

interface Props {
  rows: Zone[];
  getData: () => void;
}

const columns = [
  "ID",
  "Nombre",
  "Planta",
  "Área",
  "Creación",
  "Ultima actualización",
  "Acciones",
];

export default function TableZones({ rows, getData }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const remove = (id: number) => {
    setIsLoading(true);
    ZonesService.remove(id)
      .then(() => {
        notify("Zona eliminada correctamente", true);
        getData();
      })
      .finally(() => setIsLoading(false));
  };

  const confirmRemove = (row: Zone) => {
    toast.warning("Confirmar eliminación", {
      description: `¿Desea eliminar la zona #${row.id} (${row.name})?`,
      duration: 10000,
      cancel: {
        label: "Cancelar",
        onClick: () => undefined,
      },
      action: {
        label: "Eliminar",
        onClick: () => remove(row.id),
      },
    });
  };

  return (
    <TableDefault
      rows={rows}
      columns={columns}
      paintRows={(row: Zone) => (
        <StyledTableRow key={row.id}>
          <StyledTableCell component="th" scope="row">
            {row.id}
          </StyledTableCell>
          <StyledTableCell>{row.name}</StyledTableCell>
          <StyledTableCell>{row.manufacturingPlant.name}</StyledTableCell>
          <StyledTableCell>{row.area?.name || "-"}</StyledTableCell>
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
                onClick={() => router.push("/zones/form?id=" + row.id)}
              />
              <Chip
                icon={<DeleteIcon />}
                label="Eliminar"
                color="error"
                onClick={() => confirmRemove(row)}
                disabled={isLoading}
              />
            </Stack>
          </StyledTableCell>
        </StyledTableRow>
      )}
    />
  );
}
