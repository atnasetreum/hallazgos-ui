"use client";

import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { DashboardService } from "@services";
import { ResponseAccidents } from "@interfaces";

export const AccidentRateIndicator = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [data, setData] = useState<ResponseAccidents[]>([]);
  const [currentAccidentRate, setCurrentAccidentRate] = useState<number>(0);

  useEffect(() => {
    DashboardService.findAccidentRate().then((response) => {
      if (!response || response.length === 0) return;
      setCurrentMonth(response[0]?.nombreMes || "");
      setData(response);
    });
  }, []);

  useEffect(() => {
    if (!currentMonth || !data.length) return;

    const currentData = data.find((item) => item.nombreMes === currentMonth);

    const numeroDeAccidentes = currentData
      ? currentData.numeroDeAccidentes || 0
      : data.reduce((acc, item) => acc + (item.numeroDeAccidentes || 0), 0);
    const numeroDeEmpleados = currentData
      ? currentData.numeroDeEmpleados || 0
      : data.reduce((acc, item) => acc + (item.numeroDeEmpleados || 0), 0);

    const accidentRate = (numeroDeAccidentes / numeroDeEmpleados) * 100;

    setCurrentAccidentRate(Number(accidentRate.toFixed(2)));
  }, [currentMonth, data]);

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Índice de accidentabilidad: México
      </Typography>
      <Typography component="p" variant="h4">
        {currentAccidentRate} %
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        Febrero 2025
      </Typography>
      <br />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Mes</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Mes"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
        >
          {data.map((item) => (
            <MenuItem key={item.numeroDeMes} value={item.nombreMes}>
              {item.nombreMes}
            </MenuItem>
          ))}
          <MenuItem value="anual">Anual 2025</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};
