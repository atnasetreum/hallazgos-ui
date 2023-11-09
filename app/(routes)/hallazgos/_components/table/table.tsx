import React, { useState, useMemo } from "react";

import { AgGridReact } from "ag-grid-react";

import { Evidence } from "_interfaces/evicences.interfaces";
import { dateFormatterWithTimeForTable } from "@shared/utils";

interface Props {
  rowData: Evidence[];
}

const Table = ({ rowData }: Props) => {
  const [columnDefs] = useState([
    { headerName: "ID", field: "id" },
    { headerName: "Planta", field: "manufacturingPlant.name" },
    { headerName: "Grupo", field: "mainType.name" },
    { headerName: "Tipo de evidencia", field: "secondaryType.name" },
    { headerName: "Zona", field: "zone.name" },
    {
      headerName: "Creación",
      field: "createdAt",
      valueFormatter: dateFormatterWithTimeForTable,
    },
    {
      headerName: "Ultima actualización",
      field: "updatedAt",
      valueFormatter: dateFormatterWithTimeForTable,
    },
    {
      headerName: "Editar",
      icons: {
        menu: '<mat-icon class="mat-icon material-icons">edit</mat-icon>',
        filter: '<mat-icon class="mat-icon material-icons">edit</mat-icon>',
        columns: '<mat-icon class="mat-icon material-icons">edit</mat-icon>',
        sortAscending:
          '<mat-icon class="mat-icon material-icons">edit</mat-icon>',
        sortDescending:
          '<mat-icon class="mat-icon material-icons">edit</mat-icon>',
      },
      // cellRenderer: () => {
      //   return `<mat-icon class="mat-icon material-icons icon-edit">edit</mat-icon>`;
      // },
      // onCellClicked: (e: CellClickedEvent) => {
      //   this.router.navigate([`/clients/editar-cliente/${e.data.id}`]);
      // },
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <div className="ag-theme-alpine" style={{ width: "100%", height: 500 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default Table;
