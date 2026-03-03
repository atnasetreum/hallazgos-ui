import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { DashboardService } from "@services";
import { CriticalZone } from "@interfaces";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";

interface Props {
  manufacturingPlantId: string;
}

export const CriticalZonesAdmin = ({ manufacturingPlantId }: Props) => {
  const [criticalZones, setCriticalZones] = useState<CriticalZone[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    DashboardService.findCriticalZones({
      manufacturingPlantId,
    }).then((data) => {
      setCriticalZones(data);
      setPage(0);
    });
  }, [manufacturingPlantId]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCriticalZones = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return criticalZones;

    return criticalZones.filter((zone) =>
      Object.values(zone).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [criticalZones, searchTerm]);

  const paginatedCriticalZones = filteredCriticalZones.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Zonas críticas ·{" "}
        {criticalZones.length ? criticalZones[0].planta : "N/A"} ·{" "}
        {criticalZones.length} hallazgos abiertos
      </Typography>
      <Box
        sx={{
          mb: 2,
          p: 1,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "action.hover",
        }}
      >
        <TextField
          fullWidth
          size="small"
          variant="filled"
          label="Buscar en todas las columnas"
          placeholder="Ej. zona, responsable, días, fecha..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Box>

      <TableContainer>
        <Table size="small" aria-label="Tabla de zonas críticas">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Zona</StyledTableCell>
              <StyledTableCell align="right">Abiertas</StyledTableCell>
              <StyledTableCell>Hallazgo más antiguo</StyledTableCell>
              <StyledTableCell align="right">
                Máx. días sin resolver
              </StyledTableCell>
              <StyledTableCell align="right">
                Prom. días abierto
              </StyledTableCell>
              <StyledTableCell align="right">Nuevos este mes</StyledTableCell>
              <StyledTableCell align="right">Críticos +90 días</StyledTableCell>
              <StyledTableCell>Responsables</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {!filteredCriticalZones.length && (
              <TableRow>
                <StyledTableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary">
                    {criticalZones.length
                      ? "No se encontraron resultados con la búsqueda actual."
                      : "No hay información de zonas críticas para la planta seleccionada."}
                  </Typography>
                </StyledTableCell>
              </TableRow>
            )}

            {paginatedCriticalZones.map((zone, index) => (
              <TableRow key={`${zone.zona}-${index}`}>
                <StyledTableCell>{zone.zona}</StyledTableCell>
                <StyledTableCell align="right">
                  {zone.total_abiertas}
                </StyledTableCell>
                <StyledTableCell>
                  {new Date(zone.hallazgo_mas_antiguo).toLocaleDateString(
                    "es-MX",
                  )}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {zone.max_dias_sin_resolver}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {zone.promedio_dias_abierto}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {zone.nuevos_este_mes}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {zone.criticos_mas_90_dias}
                </StyledTableCell>
                <StyledTableCell sx={{ maxWidth: 220 }}>
                  <Tooltip title={zone.responsables || ""} arrow>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {zone.responsables}
                    </Typography>
                  </Tooltip>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!!filteredCriticalZones.length && (
        <TablePagination
          component="div"
          count={filteredCriticalZones.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página"
          showFirstButton
          showLastButton
        />
      )}
    </Paper>
  );
};

export default CriticalZonesAdmin;
