import { ChangeEvent, MouseEvent } from "react";

import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

import TablePaginationActions from "@shared/components/TablePaginationActions";

interface Props {
  rows: any[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (
    _: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  colSpan: number;
}

const TableFooterDefault = ({
  rows,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  colSpan,
}: Props) => {
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={colSpan}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
};

export default TableFooterDefault;
