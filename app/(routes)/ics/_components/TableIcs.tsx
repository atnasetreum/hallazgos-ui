import { useState } from "react";
//import { useRouter } from "next/navigation";

import DeleteIcon from "@mui/icons-material/Delete";
//import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

//import { notify, stringToDateWithTime } from "@shared/utils";
import { notify } from "@shared/utils";
import { ICSData } from "@interfaces";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { IcsService } from "@services";

interface Props {
  rows: ICSData[];
  getData: () => void;
}

const columns = [
  "ID",
  "Planta",
  "Regla de vida",
  "Estandar de comportamiento",
  "Área al que aplica",
  "Número de comportamientos seguros",
  "Número de personas observadas",
  "Índice de comportamiento seguro (%)",
  //"Fecha de creación",
  "Acciones",
];

export default function TableIcs({ rows, getData }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //const router = useRouter();

  const remove = (id: number) => {
    setIsLoading(true);
    IcsService.remove(id)
      .then(() => {
        notify("Ics eliminado correctamente", true);
        getData();
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <TableDefault
      rows={rows}
      columns={columns}
      paintRows={(row: ICSData) => {
        return (
          <StyledTableRow key={row.id}>
            <StyledTableCell component="th" scope="row">
              {row.id}
            </StyledTableCell>
            <StyledTableCell>{row.manufacturingPlant.name}</StyledTableCell>
            <StyledTableCell>{row.ruleOfLife.name}</StyledTableCell>
            <StyledTableCell>
              {row.standardOfBehavior?.name || ""}
            </StyledTableCell>
            <StyledTableCell>{row.areaOfBehavior?.name || ""}</StyledTableCell>
            <StyledTableCell>{row.numberPeopleObserved}</StyledTableCell>
            <StyledTableCell>{row.employees.length}</StyledTableCell>
            <StyledTableCell>{row.icsPercentage}%</StyledTableCell>
            {/* <StyledTableCell style={{ minWidth: 180 }}>
              {row.createdAt ? stringToDateWithTime(row.createdAt) : ""}
            </StyledTableCell> */}
            <StyledTableCell>
              <Stack direction="row" spacing={1}>
                {/* <Chip
                  icon={<EditIcon />}
                  label="Editar"
                  color="warning"
                  onClick={() => router.push("/employees/form?id=" + row.id)}
                /> */}
                <Chip
                  icon={<DeleteIcon />}
                  label="Eliminar"
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
