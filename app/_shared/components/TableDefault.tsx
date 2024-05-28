import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import TableFooterDefault from "./TableFooterDefault";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface Props {
  rows: any[];
  paintRows: (value: any, index: number, array: any[]) => ReactNode;
  columns: string[];
  page?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  rowsPerPage?: number;
  setRowsPerPage?: Dispatch<SetStateAction<number>>;
  count?: number;
}

const TableDefault = ({
  rows,
  paintRows,
  columns,
  page: pageCtrl,
  setPage: setPageCtrl,
  rowsPerPage: rowsPerPageCtrl,
  setRowsPerPage: setRowsPerPageCtrl,
  count,
}: Props) => {
  const [page, setPage] = useState(pageCtrl || 0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageCtrl || 5);
  const [colSpan] = useState(columns.length);

  useEffect(() => {
    if (setPageCtrl) {
      setPageCtrl(page);
    }
  }, [page, setPageCtrl]);

  useEffect(() => {
    if (setRowsPerPageCtrl) {
      setRowsPerPageCtrl(rowsPerPage);
    }
  }, [rowsPerPage, setRowsPerPageCtrl]);

  const handleChangePage = (
    _: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <StyledTableCell key={column}>{column}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{rows.map(paintRows)}</TableBody>
        <TableFooterDefault
          rows={rows}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          colSpan={colSpan}
          count={count}
        />
      </Table>
    </TableContainer>
  );
};

export default TableDefault;
