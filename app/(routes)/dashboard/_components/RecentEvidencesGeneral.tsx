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

import { RecentEvidence, User } from "@interfaces";
import { DashboardService } from "@services";
import { resolveTriStateSort } from "@shared/utils";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";

interface Props {
  user: User;
  manufacturingPlantId: string;
}

type Order = "asc" | "desc";
type SortableColumn =
  | "id"
  | "description"
  | "createdAt"
  | "status"
  | "tipo_principal"
  | "tipo_secundario"
  | "zona";

const RecentEvidencesGeneral = ({ user, manufacturingPlantId }: Props) => {
  const [data, setData] = useState<RecentEvidence[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<SortableColumn | null>(null);

  useEffect(() => {
    DashboardService.findRecentEvidences({
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
    (item: RecentEvidence, column: SortableColumn) => {
      switch (column) {
        case "id":
          return parseNumber(item[column]);
        case "createdAt":
          return new Date(item.createdAt).getTime();
        case "description":
        case "status":
        case "tipo_principal":
        case "tipo_secundario":
        case "zona":
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
        Evidencias recientes · Últimos {data.length} hallazgos creados.
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
          placeholder="Ej. descripción, tipo secundario, estatus, días sin atender..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Box>

      <TableContainer>
        <Table size="small" aria-label="Tabla de evidencias recientes">
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
                sx={{ minWidth: 260 }}
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
                sortDirection={orderBy === "status" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Estatus
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
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {!filtered.length && (
              <TableRow>
                <StyledTableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary">
                    {data.length
                      ? "No se encontraron resultados con la búsqueda actual."
                      : "No hay evidencias recientes."}
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
                <StyledTableCell>{item.status}</StyledTableCell>
                <StyledTableCell>{item.tipo_principal}</StyledTableCell>
                <StyledTableCell sx={{ maxWidth: 240 }}>
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

export default RecentEvidencesGeneral;
