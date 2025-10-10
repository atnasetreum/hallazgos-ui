import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";

import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { Ciael } from "@interfaces";
import { stringToDate, stringToDateWithTime } from "@shared/utils";

interface Props {
  data: Ciael[];
}

export default function TableCiaels({ data }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Tipo de evento</StyledTableCell>
            <StyledTableCell>Colaborador</StyledTableCell>
            <StyledTableCell>Fecha de evento</StyledTableCell>
            <StyledTableCell>Diagnostico CIE</StyledTableCell>
            <StyledTableCell>Área</StyledTableCell>
            <StyledTableCell>Zona</StyledTableCell>
            <StyledTableCell>Fecha de creación</StyledTableCell>
            <StyledTableCell>Usuario que reporto</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((ciael) => (
            <StyledTableRow
              key={ciael.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {ciael.description}
              </StyledTableCell>
              <StyledTableCell>{ciael.employee.name}</StyledTableCell>
              <StyledTableCell>{stringToDate(ciael.eventDate)}</StyledTableCell>
              <StyledTableCell>{ciael.cieDiagnosis.name}</StyledTableCell>
              <StyledTableCell>{ciael.zone.area?.name}</StyledTableCell>
              <StyledTableCell>{ciael.zone.name}</StyledTableCell>
              <StyledTableCell>
                {stringToDateWithTime(ciael.createdAt)}
              </StyledTableCell>
              <StyledTableCell>{ciael.createdBy.name}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
