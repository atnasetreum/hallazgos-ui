import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { toast } from "sonner";

import { notify, stringToDateWithTime } from "@shared/utils";
import { EmergencyTeam } from "@interfaces";
import { EmergencyTeamsService } from "@services";
import {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";

interface Props {
  rows: EmergencyTeam[];
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  onPrintRows: (rows: EmergencyTeam[]) => void;
  getData: () => void;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: TablePaginationActionsProps) {
  const theme = useTheme();

  const handleFirstPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={rowsPerPage > 0 && page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={rowsPerPage > 0 && page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function EmergencyTeamsTable({
  rows,
  selectedIds,
  setSelectedIds,
  onPrintRows,
  getData,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const router = useRouter();

  const paginatedRows =
    rowsPerPage > 0
      ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : rows;

  const emptyRows =
    page > 0 && rowsPerPage > 0
      ? Math.max(0, (1 + page) * rowsPerPage - rows.length)
      : 0;

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [rows.length, rowsPerPage, page]);

  const remove = (id: number) => {
    setIsLoading(true);
    EmergencyTeamsService.remove(id)
      .then(() => {
        notify("Equipo de emergencia eliminado correctamente", true);
        getData();
      })
      .finally(() => setIsLoading(false));
  };

  const confirmRemove = (row: EmergencyTeam) => {
    toast.warning("Confirmar eliminación", {
      description: `¿Desea eliminar el equipo #${row.id} (${row.location})?`,
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

  const isSelected = (id: number) => selectedIds.includes(id);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageIds = paginatedRows.map((row) => row.id);
      const merged = Array.from(new Set([...selectedIds, ...currentPageIds]));
      setSelectedIds(merged);
      return;
    }

    const currentPageIdSet = new Set(paginatedRows.map((row) => row.id));
    setSelectedIds(
      selectedIds.filter((selectedId) => !currentPageIdSet.has(selectedId)),
    );
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(Array.from(new Set([...selectedIds, id])));
      return;
    }

    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const selectedCurrentPageCount = paginatedRows.filter((row) =>
    selectedIds.includes(row.id),
  ).length;
  const allChecked =
    paginatedRows.length > 0 &&
    selectedCurrentPageCount === paginatedRows.length;
  const someChecked =
    selectedCurrentPageCount > 0 &&
    selectedCurrentPageCount < paginatedRows.length;

  const handleChangePage = (
    _event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Ubicación</StyledTableCell>
              <StyledTableCell>N. Extintor</StyledTableCell>
              <StyledTableCell>Tipo</StyledTableCell>
              <StyledTableCell>Capacidad</StyledTableCell>
              <StyledTableCell>Creado por</StyledTableCell>
              <StyledTableCell>Actualizado por</StyledTableCell>
              <StyledTableCell>QR</StyledTableCell>
              <StyledTableCell>Creación</StyledTableCell>
              <StyledTableCell>Ultima actualización</StyledTableCell>
              <StyledTableCell>Acciones</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <StyledTableRow key={row.id} hover>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected(row.id)}
                    onChange={(e) => handleSelectOne(row.id, e.target.checked)}
                  />
                </StyledTableCell>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell>{row.location}</StyledTableCell>
                <StyledTableCell>{row.extinguisherNumber}</StyledTableCell>
                <StyledTableCell>{row.typeOfExtinguisher}</StyledTableCell>
                <StyledTableCell>{row.capacity}</StyledTableCell>
                <StyledTableCell>{row.createdBy?.name || "-"}</StyledTableCell>
                <StyledTableCell>{row.updatedBy?.name || "-"}</StyledTableCell>
                <StyledTableCell>
                  <Tooltip title="Imprimir QR">
                    <IconButton
                      color="primary"
                      onClick={() => onPrintRows([row])}
                    >
                      <QrCode2Icon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
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
                        router.push("/emergency-teams/form?id=" + row.id)
                      }
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
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={12} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <StyledTableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={12}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </StyledTableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
