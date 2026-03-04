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
import {
  PendingBySeniorityByUser as PendingBySeniorityByUserItem,
  User,
} from "@interfaces";
import { resolveTriStateSort } from "@shared/utils";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";

interface Props {
  manufacturingPlantId: string;
  user: User;
}

type Order = "asc" | "desc";
type SortableColumn =
  | "id"
  | "description"
  | "createdAt"
  | "tipo_principal"
  | "tipo_secundario"
  | "zona"
  | "creado_por"
  | "dias_sin_resolver";

const PendingBySeniorityByUser = ({ manufacturingPlantId, user }: Props) => {
  const [data, setData] = useState<PendingBySeniorityByUserItem[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<SortableColumn | null>(null);

  useEffect(() => {
    DashboardService.findPendingBySeniorityByUser({
      manufacturingPlantId,
      userId: user.id,
    }).then((response) => {
      setData(response);
      setPage(0);
    });
  }, [manufacturingPlantId, user.id]);

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
    const { nextOrder, nextOrderBy } = resolveTriStateSort(
      order,
      orderBy,
      property,
    );

    setOrder(nextOrder);
    setOrderBy(nextOrderBy);
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
    (item: PendingBySeniorityByUserItem, column: SortableColumn) => {
      switch (column) {
        case "id":
        case "dias_sin_resolver":
          return parseNumber(item[column]);
        case "createdAt":
          return new Date(item.createdAt).getTime();
        case "description":
        case "tipo_principal":
        case "tipo_secundario":
        case "zona":
        case "creado_por":
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
    if (!orderBy) return filtered;

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

  const formatDateTime = (value: Date) => {
    const parsedDate = new Date(value);

    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(parsedDate);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Pendientes por antigüedad · {data.length} hallazgos
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
          placeholder="Ej. descripción, tipo, zona, creador, días sin resolver..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Box>

      <TableContainer>
        <Table size="small" aria-label="Tabla de pendientes por antigüedad">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sortDirection={orderBy === "id" ? order : false}>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleRequestSort("id")}
                >
                  ID
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sx={{ minWidth: 240 }}
                sortDirection={orderBy === "description" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={() => handleRequestSort("description")}
                >
                  Descripción
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "createdAt" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? order : "asc"}
                  onClick={() => handleRequestSort("createdAt")}
                >
                  Fecha creación
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "tipo_principal" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "tipo_principal"}
                  direction={orderBy === "tipo_principal" ? order : "asc"}
                  onClick={() => handleRequestSort("tipo_principal")}
                >
                  Tipo principal
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "tipo_secundario" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "tipo_secundario"}
                  direction={orderBy === "tipo_secundario" ? order : "asc"}
                  onClick={() => handleRequestSort("tipo_secundario")}
                >
                  Tipo secundario
                </TableSortLabel>
              </StyledTableCell>
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
                sortDirection={orderBy === "creado_por" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "creado_por"}
                  direction={orderBy === "creado_por" ? order : "asc"}
                  onClick={() => handleRequestSort("creado_por")}
                >
                  Creado por
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell
                sortDirection={orderBy === "dias_sin_resolver" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "dias_sin_resolver"}
                  direction={orderBy === "dias_sin_resolver" ? order : "asc"}
                  onClick={() => handleRequestSort("dias_sin_resolver")}
                >
                  Días sin resolver
                </TableSortLabel>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {!filtered.length && (
              <TableRow>
                <StyledTableCell colSpan={8}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 3 }}
                  >
                    {data.length
                      ? "No se encontraron resultados con la búsqueda actual."
                      : "No hay pendientes por antigüedad."}
                  </Typography>
                </StyledTableCell>
              </TableRow>
            )}

            {paginated.map((item) => (
              <TableRow key={item.id}>
                <StyledTableCell>{item.id}</StyledTableCell>
                <StyledTableCell sx={{ maxWidth: 320 }}>
                  <Tooltip title={item.description || ""} arrow>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {item.description}
                    </Typography>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell>
                  {formatDateTime(item.createdAt)}
                </StyledTableCell>
                <StyledTableCell>{item.tipo_principal}</StyledTableCell>
                <StyledTableCell sx={{ maxWidth: 220 }}>
                  <Tooltip title={item.tipo_secundario || ""} arrow>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {item.tipo_secundario}
                    </Typography>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell>{item.zona}</StyledTableCell>
                <StyledTableCell sx={{ maxWidth: 220 }}>
                  <Tooltip title={item.creado_por || ""} arrow>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {item.creado_por}
                    </Typography>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell>{item.dias_sin_resolver}</StyledTableCell>
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

export default PendingBySeniorityByUser;
