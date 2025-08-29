import { useState } from "react";

import Image from "next/image";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";

import { stringYYYYMMDDToDDMMYYYY } from "@shared/utils";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { EppService } from "@services";
import { Epp } from "@interfaces";

function Row({ epp }: { epp: Epp }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {epp.name}
        </StyledTableCell>
        <StyledTableCell>{epp.code}</StyledTableCell>
        <StyledTableCell>{epp.position.name}</StyledTableCell>
        <StyledTableCell>{epp.area.name}</StyledTableCell>
        <StyledTableCell align="center">
          <SimCardDownloadIcon
            color="primary"
            fontSize="large"
            style={{ cursor: "pointer" }}
            onClick={() => EppService.downloadFile(epp.id)}
          />
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Historial
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Epp</StyledTableCell>
                    <StyledTableCell>Fecha de entrega</StyledTableCell>
                    <StyledTableCell>Fecha devolución</StyledTableCell>
                    <StyledTableCell>Observaciones</StyledTableCell>
                    <StyledTableCell>Firma</StyledTableCell>
                    <StyledTableCell>Entregado por</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {epp.epps
                    .flatMap((epp) =>
                      epp.equipments.map((item) => ({
                        ...item,
                        signature: epp.signature,
                        createBy: epp.createBy,
                      }))
                    )
                    .map((equipment) => (
                      <StyledTableRow key={equipment.id}>
                        <StyledTableCell component="th" scope="row">
                          {equipment.equipment.name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {stringYYYYMMDDToDDMMYYYY(equipment.deliveryDate)}
                        </StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell>
                          {equipment.observations}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Image
                            src={equipment.signature}
                            alt="Firma digital"
                            style={{ border: "1px solid #ccc" }}
                            width={75}
                            height={50}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          {equipment.createBy.name}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}

interface Props {
  data: Epp[];
}

export default function TableEpps({ data }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell />
            <StyledTableCell>Empleado</StyledTableCell>
            <StyledTableCell>Cédula</StyledTableCell>
            <StyledTableCell>Cargo</StyledTableCell>
            <StyledTableCell>Área</StyledTableCell>
            <StyledTableCell align="center">Descargar archivo</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((epp) => (
            <Row key={epp.id} epp={epp} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
