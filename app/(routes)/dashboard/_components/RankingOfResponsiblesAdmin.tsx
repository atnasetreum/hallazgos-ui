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

import { RankingOfResponsible } from "@interfaces";
import { DashboardService } from "@services";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";

interface Props {
  manufacturingPlantId: string;
}

type Order = "asc" | "desc";
type SortableColumn =
  | "user_id"
  | "responsable"
  | "total_asignadas"
  | "pendientes"
  | "cerradas"
  | "canceladas"
  | "pct_resolucion"
  | "total_mes_actual"
  | "total_mes_anterior"
  | "pendientes_mes_actual"
  | "pendientes_mes_anterior"
  | "cerradas_mes_actual"
  | "cerradas_mes_anterior"
  | "pct_carga"
  | "pct_cerradas";

export const RankingOfResponsiblesAdmin = ({ manufacturingPlantId }: Props) => {
  const [data, setData] = useState<RankingOfResponsible[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortableColumn>("user_id");

  useEffect(() => {
    DashboardService.findRankingOfResponsibles({
      manufacturingPlantId,
    }).then((data) => {
      setData(data);
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
    (item: RankingOfResponsible, column: SortableColumn) => {
      switch (column) {
        case "user_id":
        case "total_asignadas":
        case "pendientes":
        case "cerradas":
        case "canceladas":
        case "pct_resolucion":
        case "total_mes_actual":
        case "total_mes_anterior":
        case "pendientes_mes_actual":
        case "pendientes_mes_anterior":
        case "cerradas_mes_actual":
        case "cerradas_mes_anterior":
        case "pct_carga":
        case "pct_cerradas":
          return parseNumber(item[column]);
        case "responsable":
        default:
          return String(item[column] ?? "").toLowerCase();
      }
    },
    [parseNumber],
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return data;

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [data, searchTerm]);

  const sorted = useMemo(() => {
    return [...filtered]
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const valueA = getSortValue(a.item, orderBy);
        const valueB = getSortValue(b.item, orderBy);

        if (valueA < valueB) return order === "asc" ? -1 : 1;
        if (valueA > valueB) return order === "asc" ? 1 : -1;
        return a.index - b.index;
      })
      .map(({ item }) => item);
  }, [filtered, getSortValue, order, orderBy]);

  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ranking de responsables · {data.length ? data[0].planta : "N/A"} ·{" "}
        {data.length} responsables
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
          placeholder="Ej. nombre del responsable, número de hallazgos, % de resolución..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Box>

      <TableContainer>
        <Table size="small" aria-label="Tabla de ranking de responsables">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell
                sortDirection={orderBy === "user_id" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "user_id"}
                  direction={orderBy === "user_id" ? order : "asc"}
                  onClick={() => handleRequestSort("user_id")}
                >
                  ID
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "responsable" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "responsable"}
                  direction={orderBy === "responsable" ? order : "asc"}
                  onClick={() => handleRequestSort("responsable")}
                >
                  Responsable
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sx={{ width: 100, maxWidth: 100 }}
                sortDirection={orderBy === "total_asignadas" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "total_asignadas"}
                  direction={orderBy === "total_asignadas" ? order : "asc"}
                  onClick={() => handleRequestSort("total_asignadas")}
                >
                  Total asignadas
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell sx={{ width: 100, maxWidth: 100 }}>
                <TableSortLabel
                  active={orderBy === "pendientes"}
                  direction={orderBy === "pendientes" ? order : "asc"}
                  onClick={() => handleRequestSort("pendientes")}
                >
                  Pendientes
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell sx={{ width: 100, maxWidth: 100 }}>
                <TableSortLabel
                  active={orderBy === "cerradas"}
                  direction={orderBy === "cerradas" ? order : "asc"}
                  onClick={() => handleRequestSort("cerradas")}
                >
                  Cerradas
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sx={{ width: 120, maxWidth: 120 }}
                sortDirection={orderBy === "canceladas" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "canceladas"}
                  direction={orderBy === "canceladas" ? order : "asc"}
                  onClick={() => handleRequestSort("canceladas")}
                >
                  Canceladas
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "pct_resolucion" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "pct_resolucion"}
                  direction={orderBy === "pct_resolucion" ? order : "asc"}
                  onClick={() => handleRequestSort("pct_resolucion")}
                >
                  % Resolución
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "total_mes_actual" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "total_mes_actual"}
                  direction={orderBy === "total_mes_actual" ? order : "asc"}
                  onClick={() => handleRequestSort("total_mes_actual")}
                >
                  Total mes actual
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "total_mes_anterior" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "total_mes_anterior"}
                  direction={orderBy === "total_mes_anterior" ? order : "asc"}
                  onClick={() => handleRequestSort("total_mes_anterior")}
                >
                  Total mes anterior
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={
                  orderBy === "pendientes_mes_actual" ? order : false
                }
              >
                <TableSortLabel
                  active={orderBy === "pendientes_mes_actual"}
                  direction={
                    orderBy === "pendientes_mes_actual" ? order : "asc"
                  }
                  onClick={() => handleRequestSort("pendientes_mes_actual")}
                >
                  Pendientes mes actual
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={
                  orderBy === "pendientes_mes_anterior" ? order : false
                }
              >
                <TableSortLabel
                  active={orderBy === "pendientes_mes_anterior"}
                  direction={
                    orderBy === "pendientes_mes_anterior" ? order : "asc"
                  }
                  onClick={() => handleRequestSort("pendientes_mes_anterior")}
                >
                  Pendientes mes anterior
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={
                  orderBy === "cerradas_mes_actual" ? order : false
                }
              >
                <TableSortLabel
                  active={orderBy === "cerradas_mes_actual"}
                  direction={orderBy === "cerradas_mes_actual" ? order : "asc"}
                  onClick={() => handleRequestSort("cerradas_mes_actual")}
                >
                  Cerradas mes actual
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={
                  orderBy === "cerradas_mes_anterior" ? order : false
                }
              >
                {" "}
                <TableSortLabel
                  active={orderBy === "cerradas_mes_anterior"}
                  direction={
                    orderBy === "cerradas_mes_anterior" ? order : "asc"
                  }
                  onClick={() => handleRequestSort("cerradas_mes_anterior")}
                >
                  Cerradas mes anterior
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "pct_carga" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "pct_carga"}
                  direction={orderBy === "pct_carga" ? order : "asc"}
                  onClick={() => handleRequestSort("pct_carga")}
                >
                  % Carga
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "pct_cerradas" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "pct_cerradas"}
                  direction={orderBy === "pct_cerradas" ? order : "asc"}
                  onClick={() => handleRequestSort("pct_cerradas")}
                >
                  % Cerradas
                </TableSortLabel>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {!filtered.length && (
              <TableRow>
                <StyledTableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary">
                    {data.length
                      ? "No se encontraron resultados con la búsqueda actual."
                      : "No hay información de ranking para la planta seleccionada."}
                  </Typography>
                </StyledTableCell>
              </TableRow>
            )}

            {paginated.map((item, index) => (
              <TableRow key={`${item.user_id}-${index}`}>
                <StyledTableCell>{item.user_id}</StyledTableCell>
                <StyledTableCell sx={{ maxWidth: 220 }}>
                  <Tooltip title={item.responsable || ""} arrow>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {item.responsable}
                    </Typography>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell>{item.total_asignadas}</StyledTableCell>
                <StyledTableCell>{item.pendientes}</StyledTableCell>
                <StyledTableCell>{item.cerradas}</StyledTableCell>
                <StyledTableCell sx={{ width: 50, maxWidth: 50 }}>
                  {item.canceladas}
                </StyledTableCell>
                <StyledTableCell>{item.pct_resolucion}</StyledTableCell>
                <StyledTableCell>{item.total_mes_actual}</StyledTableCell>
                <StyledTableCell>{item.total_mes_anterior}</StyledTableCell>
                <StyledTableCell>{item.pendientes_mes_actual}</StyledTableCell>
                <StyledTableCell>
                  {item.pendientes_mes_anterior}
                </StyledTableCell>
                <StyledTableCell>{item.cerradas_mes_actual}</StyledTableCell>
                <StyledTableCell>{item.cerradas_mes_anterior}</StyledTableCell>
                <StyledTableCell>{item.pct_carga}</StyledTableCell>
                <StyledTableCell>{item.pct_cerradas}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!!filtered.length && (
        <TablePagination
          component="div"
          count={filtered.length}
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

export default RankingOfResponsiblesAdmin;
