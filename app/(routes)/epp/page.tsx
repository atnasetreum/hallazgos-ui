"use client";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { EppService } from "@services";

export default function EppPage() {
  const createEppFormat = () => {
    EppService.create({
      employeeId: 3,
      signature: "kjsghdfkjsdf",
      equipments: [
        {
          id: 1,
          quantity: 1,
          observations: "test",
        },
        {
          id: 2,
          quantity: 1,
          observations: "test",
        },
      ],
    }).then((response) => {
      console.log(response);
      /* XLSX.fromFileAsync("formatoEPP.xlsx")
        .then((workbook) => {
          // Selecciona la hoja de cálculo por su nombre (reemplaza "Hoja1" por el nombre de tu hoja)
          const sheet = workbook.sheet("EPP Personas");

          // Escribe la información en la celda A1
          sheet.cell("B4").value("Nuevo dato en B4");

          // Guarda los cambios en un nuevo archivo o sobrescribe el existente
          return workbook.toFileAsync("archivo_actualizado.xlsx");
        })
        .then((res) => {
          console.log("Archivo Excel actualizado correctamente.", res.message);
        })
        .catch((err) => {
          console.error("Error al actualizar el archivo Excel:", err);
        }); */
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={8}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button variant="contained" onClick={createEppFormat}>
            Crear formato
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
