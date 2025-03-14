"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ButtonGroup from "@mui/material/ButtonGroup";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { utils, WorkBook, writeFileXLSX } from "xlsx";
import { Content, StyleDictionary } from "pdfmake/interfaces";
import * as pdfMake from "pdfmake/build/pdfmake";
import { toast } from "sonner";
import LoadingButton from "@mui/lab/LoadingButton";

import TableEvidences from "./_components/TableEvidences";
import LoadingLinear from "@shared/components/LoadingLinear";
import FiltersEvidence, {
  FiltersEvidences,
} from "./_components/FiltersEvidence";
import {
  baseUrlImage,
  durantionToTime,
  stringToDateWithTime,
} from "@shared/utils";
import { useEvidences } from "@hooks";
import { EvidencesService } from "@services";

export default function HallazgosPage() {
  const [filters, setFilters] = useState<FiltersEvidences>({
    manufacturingPlantId: "",
    mainTypeId: "",
    secondaryType: "",
    zone: "",
    process: "",
    state: "",
  });

  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState<boolean>(false);

  const {
    findEvidences,
    evidences,
    isLoading,
    countEvidence,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  } = useEvidences();

  const router = useRouter();

  const getData = useCallback(() => {
    findEvidences(filters);
  }, [filters, page, rowsPerPage]);

  const createExcel = () => {
    if (!filters.manufacturingPlantId) {
      toast.error("Seleccione una planta");
      return;
    }
    setIsLoadingExcel(true);
    EvidencesService.findAll(filters)
      .then(async (evidencesCurrent) => {
        const data = evidencesCurrent.map((evidence) => ({
          ["ID"]: evidence.id,
          ["Palnta"]: evidence.manufacturingPlant.name,
          ["Grupo"]: evidence.mainType.name,
          ["Tipo de hallazgo"]: evidence.secondaryType.name,
          ["Zona"]: evidence.zone.name,
          ["Proceso"]: evidence.process,
          ["Creado por"]: evidence.user.name,
          ["Supervisores"]: evidence.supervisors
            .map((supervisor) => supervisor.name)
            .join(" / "),
          ["Responsables"]: evidence.responsibles
            .map((supervisor) => supervisor.name)
            .join(" / "),
          ["Estatus"]: evidence.status,
          ["Fecha de creación"]: stringToDateWithTime(evidence.createdAt),
          ["Fecha de actualización"]: stringToDateWithTime(evidence.updatedAt),
          ["Fecha de cierre"]: evidence.solutionDate
            ? stringToDateWithTime(evidence.solutionDate)
            : "",
          ["Tiempo de solución"]: evidence.solutionDate
            ? durantionToTime(evidence.createdAt, evidence.solutionDate)
            : "",
        }));
        const wb: WorkBook = utils.book_new();
        const ws = utils.json_to_sheet(data);
        utils.book_append_sheet(wb, ws, "SheetJS");
        writeFileXLSX(wb, "hallazgos.xlsx");
      })
      .finally(() => setIsLoadingExcel(false));
  };

  const getBase64ImageFromURL = (url: string) => {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");

        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  };

  const createPdf = () => {
    if (!filters.manufacturingPlantId) {
      toast.error("Seleccione una planta");
      return;
    }

    setIsLoadingPdf(true);

    EvidencesService.findAll(filters)
      .then(async (evidencesCurrent) => {
        const data = [];

        const manufacturingPlant = evidencesCurrent[0]?.manufacturingPlant;

        let imgSolutionTmp = (await getBase64ImageFromURL(
          baseUrlImage("logo-pdf.png", "/static/images/")
        )) as string;

        const logo: Content = {
          image: imgSolutionTmp,
          width: 100,
          height: 100,
          alignment: "center",
          margin: [0, 0, 0, 20],
        };

        const styles: StyleDictionary = {
          header: {
            fontSize: 22,
            bold: true,
            alignment: "center",
            margin: [0, 60, 0, 20],
          },
          body: {
            alignment: "justify",
            margin: [0, 0, 0, 70],
          },
          signature: {
            //fontSize: 14,
            bold: true,
            // alignment: 'left',
            background: "#66BB6A",
          },
          footer: {
            fontSize: 10,
            italics: true,
            alignment: "center",
            margin: [0, 0, 0, 20],
          },
        };

        const headers = [
          "ID",
          "Grupo",
          "Tipo de hallazgo",
          "Zona",
          "Proceso",
          "Creado por",
          "Estatus",
          "Fecha de creación",
          "Imagen de hallazgo",
          "Imagen de solución",
        ];

        for (const evidence of evidencesCurrent) {
          const imgEvidence = await getBase64ImageFromURL(
            baseUrlImage(evidence?.imgEvidence || "")
          );

          const imgSolutionValue = evidence?.imgSolution;

          const imageSolutionRaw = baseUrlImage(
            imgSolutionValue || "image-not-found.png",
            imgSolutionValue ? "" : "/static/images/"
          );

          const imgSolution = await getBase64ImageFromURL(imageSolutionRaw);

          data.push([
            evidence.id,
            evidence.mainType.name,
            evidence.secondaryType.name,
            evidence.zone.name,
            evidence.process?.name || "",
            evidence.user.name,
            {
              text: evidence.status,
              style: evidence.status === "Cerrado" ? "signature" : "",
            },
            stringToDateWithTime(evidence.createdAt),
            {
              image: imgEvidence,
              width: 50,
              height: 50,
            },
            {
              image: imgSolution,
              width: 50,
              height: 50,
            },
          ]);
        }

        const manufacturingPlantName = manufacturingPlant?.name;

        const dateReport = new Date().toLocaleString();

        const nameFile = `${manufacturingPlantName}-${dateReport}.pdf`;

        pdfMake
          .createPdf(
            {
              styles,
              pageMargins: [40, 110, 40, 60],
              pageOrientation: "landscape",
              header: {
                columns: [
                  logo,
                  {
                    text: `Hallazgos - "${manufacturingPlantName}"`,
                    alignment: "right",
                    margin: [40, 40],
                  },
                  {
                    text: "Fecha de reporte: " + dateReport,
                    alignment: "right",
                    margin: [40, 40],
                  },
                ],
              },
              content: [
                {
                  layout: "lightHorizontalLines",
                  table: {
                    headerRows: 1,
                    widths: data[0].map(() => "auto"),

                    body: [[...headers], ...data],
                  },
                },
              ],
            },
            undefined,
            {
              Roboto: {
                normal:
                  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
                bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
                italics:
                  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
                bolditalics:
                  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
              },
            }
          )
          .download(nameFile);
        //.open({}, window.open("", "_blank"));
      })
      .finally(() => setIsLoadingPdf(false));
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddAPhotoIcon />}
              onClick={() => router.push("/hallazgos/form")}
            >
              Crear
            </Button>
          </Box>

          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => getData()}
            ></Button>
            <LoadingButton
              variant="contained"
              startIcon={<SimCardDownloadIcon />}
              onClick={() => createExcel()}
              loading={isLoadingExcel}
            >
              EXCEL
            </LoadingButton>
            <LoadingButton
              variant="contained"
              startIcon={<SimCardDownloadIcon />}
              onClick={() => createPdf()}
              loading={isLoadingPdf}
            >
              PDF
            </LoadingButton>
          </ButtonGroup>
        </Toolbar>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <FiltersEvidence
          filters={filters}
          setFilters={setFilters}
          count={countEvidence}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {isLoading ? (
          <LoadingLinear />
        ) : (
          <TableEvidences
            rows={evidences}
            getData={getData}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            countEvidence={countEvidence}
          />
        )}
      </Grid>
    </Grid>
  );
}
