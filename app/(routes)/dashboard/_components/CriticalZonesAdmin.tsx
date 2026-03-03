import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
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

type Order = "asc" | "desc";
type SortableColumn =
  | "zona"
  | "total_abiertas"
  | "hallazgo_mas_antiguo"
  | "max_dias_sin_resolver"
  | "promedio_dias_abierto"
  | "nuevos_este_mes"
  | "criticos_mas_90_dias"
  | "responsables";

export const CriticalZonesAdmin = ({ manufacturingPlantId }: Props) => {
  const [criticalZones, setCriticalZones] = useState<CriticalZone[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortableColumn>("zona");

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

  const handleRequestSort = (property: SortableColumn) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  const parseNumber = useCallback(
    (value: string | number | null | undefined) => {
      if (typeof value === "number") return value;

      const parsed = Number(
        String(value ?? "")
          .replace(/,/g, "")
          .trim(),
      );
      return Number.isNaN(parsed) ? 0 : parsed;
    },
    [],
  );

  const getSortValue = useCallback(
    (zone: CriticalZone, column: SortableColumn) => {
      switch (column) {
        case "hallazgo_mas_antiguo":
          return new Date(zone.hallazgo_mas_antiguo).getTime();
        case "total_abiertas":
        case "max_dias_sin_resolver":
        case "promedio_dias_abierto":
        case "nuevos_este_mes":
        case "criticos_mas_90_dias":
          return parseNumber(zone[column]);
        case "zona":
        case "responsables":
        default:
          return String(zone[column] ?? "").toLowerCase();
      }
    },
    [parseNumber],
  );

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

  const sortedCriticalZones = useMemo(() => {
    return [...filteredCriticalZones]
      .map((zone, index) => ({ zone, index }))
      .sort((a, b) => {
        const valueA = getSortValue(a.zone, orderBy);
        const valueB = getSortValue(b.zone, orderBy);

        if (valueA < valueB) return order === "asc" ? -1 : 1;
        if (valueA > valueB) return order === "asc" ? 1 : -1;
        return a.index - b.index;
      })
      .map(({ zone }) => zone);
  }, [filteredCriticalZones, getSortValue, order, orderBy]);

  const paginatedCriticalZones = sortedCriticalZones.slice(
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
              <StyledTableCell
                sortDirection={orderBy === "zona" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "zona"}
                  direction={orderBy === "zona" ? order : "asc"}
                  onClick={() => handleRequestSort("zona")}
                >
                  Zona
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                align="right"
                sortDirection={orderBy === "total_abiertas" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "total_abiertas"}
                  direction={orderBy === "total_abiertas" ? order : "asc"}
                  onClick={() => handleRequestSort("total_abiertas")}
                >
                  Abiertas
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={
                  orderBy === "hallazgo_mas_antiguo" ? order : false
                }
              >
                <TableSortLabel
                  active={orderBy === "hallazgo_mas_antiguo"}
                  direction={orderBy === "hallazgo_mas_antiguo" ? order : "asc"}
                  onClick={() => handleRequestSort("hallazgo_mas_antiguo")}
                >
                  Hallazgo más antiguo
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableSortLabel
                  active={orderBy === "max_dias_sin_resolver"}
                  direction={
                    orderBy === "max_dias_sin_resolver" ? order : "asc"
                  }
                  onClick={() => handleRequestSort("max_dias_sin_resolver")}
                >
                  Máx. días sin resolver
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableSortLabel
                  active={orderBy === "promedio_dias_abierto"}
                  direction={
                    orderBy === "promedio_dias_abierto" ? order : "asc"
                  }
                  onClick={() => handleRequestSort("promedio_dias_abierto")}
                >
                  Prom. días abierto
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                align="right"
                sortDirection={orderBy === "nuevos_este_mes" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "nuevos_este_mes"}
                  direction={orderBy === "nuevos_este_mes" ? order : "asc"}
                  onClick={() => handleRequestSort("nuevos_este_mes")}
                >
                  Nuevos este mes
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                align="right"
                sortDirection={
                  orderBy === "criticos_mas_90_dias" ? order : false
                }
              >
                <TableSortLabel
                  active={orderBy === "criticos_mas_90_dias"}
                  direction={orderBy === "criticos_mas_90_dias" ? order : "asc"}
                  onClick={() => handleRequestSort("criticos_mas_90_dias")}
                >
                  Críticos +90 días
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "responsables" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "responsables"}
                  direction={orderBy === "responsables" ? order : "asc"}
                  onClick={() => handleRequestSort("responsables")}
                >
                  Responsables
                </TableSortLabel>
              </StyledTableCell>
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
