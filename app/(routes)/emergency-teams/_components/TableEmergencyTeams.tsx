import { useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import { notify, stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import { EmergencyTeam } from "@interfaces";
import { EmergencyTeamsService } from "@services";

interface Props {
  rows: EmergencyTeam[];
  getData: () => void;
}

const columns = [
  "ID",
  "Ubicación",
  "N. Extintor",
  "Tipo",
  "Capacidad",
  "Creado por",
  "Actualizado por",
  "QR",
  "Creación",
  "Ultima actualización",
  "Acciones",
];

export default function TableEmergencyTeams({ rows, getData }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openQrModal, setOpenQrModal] = useState<boolean>(false);
  const [qrCodeCurrent, setQrCodeCurrent] = useState<string>("");
  const [idCurrent, setIdCurrent] = useState<number>(0);

  const router = useRouter();

  const remove = (id: number) => {
    setIsLoading(true);
    EmergencyTeamsService.remove(id)
      .then(() => {
        notify("Equipo de emergencia eliminado correctamente", true);
        getData();
      })
      .finally(() => setIsLoading(false));
  };

  const openQr = async (row: EmergencyTeam) => {
    setIdCurrent(row.id);
    const generatedQrCode = await QRCode.toDataURL(row.id.toString());
    setQrCodeCurrent(generatedQrCode);
    setOpenQrModal(true);
  };

  const closeQr = () => {
    setOpenQrModal(false);
    setQrCodeCurrent("");
    setIdCurrent(0);
  };

  const printQr = () => {
    if (!qrCodeCurrent) {
      notify("No existe código QR para imprimir");
      return;
    }

    const printWindow = window.open(
      "about:blank",
      "_blank",
      "width=900,height=700",
    );

    if (!printWindow) {
      notify("No se pudo abrir la ventana de impresión");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Equipo #${idCurrent}</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }

            body {
              margin: 0;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .qr-wrap {
              width: 5cm;
              height: 5cm;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            img {
              width: 5cm;
              height: 5cm;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="qr-wrap">
            <img src="${qrCodeCurrent}" alt="QR equipo ${idCurrent}" />
          </div>
          <script>
            window.onload = function () {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <>
      <TableDefault
        rows={rows}
        columns={columns}
        paintRows={(row: EmergencyTeam) => (
          <StyledTableRow key={row.id}>
            <StyledTableCell component="th" scope="row">
              {row.id}
            </StyledTableCell>
            <StyledTableCell>{row.location}</StyledTableCell>
            <StyledTableCell>{row.extinguisherNumber}</StyledTableCell>
            <StyledTableCell>{row.typeOfExtinguisher}</StyledTableCell>
            <StyledTableCell>{row.capacity}</StyledTableCell>
            <StyledTableCell>{row.createdBy?.name || "-"}</StyledTableCell>
            <StyledTableCell>{row.updatedBy?.name || "-"}</StyledTableCell>
            <StyledTableCell>
              <Tooltip title="Ver QR">
                <IconButton color="primary" onClick={() => openQr(row)}>
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
                  onClick={() => remove(row.id)}
                  disabled={isLoading}
                />
              </Stack>
            </StyledTableCell>
          </StyledTableRow>
        )}
      />

      <Dialog open={openQrModal} onClose={closeQr} fullWidth maxWidth="md">
        <DialogTitle>QR Equipo #{idCurrent}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
              p: 2,
            }}
          >
            {qrCodeCurrent ? (
              <Image
                src={qrCodeCurrent}
                alt={`QR equipo ${idCurrent}`}
                width={650}
                height={650}
                unoptimized
                style={{
                  width: "min(70vh, 100%)",
                  height: "auto",
                  maxWidth: "650px",
                }}
              />
            ) : (
              <span>No hay QR disponible</span>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<PrintIcon />}
            variant="contained"
            onClick={printQr}
          >
            Imprimir 5x5 cm
          </Button>
          <Button startIcon={<CloseIcon />} color="inherit" onClick={closeQr}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
