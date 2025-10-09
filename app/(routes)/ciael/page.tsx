"use client";

import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import DialogCreateCiael from "./components/DialogCreateCiael";

const CiaelPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DialogCreateCiael open={open} setOpen={setOpen} />
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
          {/* <TableEpps data={data} /> */}
        </Grid>
      </Grid>
    </>
  );
};

export default CiaelPage;
