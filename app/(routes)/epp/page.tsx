"use client";

import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";

import DialogCreateEpp from "./_components/DialogCreateEpp";
import TableEpps from "./_components/TableEpps";
import { EppService } from "@services";
import { Epp } from "@interfaces";

export default function EppPage() {
  const [data, setData] = useState<Epp[]>([]);
  const [open, setOpen] = useState(false);

  const getData = () => {
    EppService.findAll().then(setData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <DialogCreateEpp
        open={open}
        create={(form) => {
          const confirm = Object.keys(form).length > 0;
          if (!confirm) return setOpen(false);
          EppService.create(form).then(() => {
            setOpen(false);
            getData();
          });
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={2} lg={2}>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            startIcon={<AddIcon />}
          >
            Crear registro
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TableEpps data={data} />
        </Grid>
      </Grid>
    </>
  );
}
