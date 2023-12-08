import { useState } from "react";

import Image from "next/image";

import { baseUrlImage, stringToDateWithTime } from "@shared/utils";
import TableDefault, {
  StyledTableCell,
  StyledTableRow,
} from "@shared/components/TableDefault";
import ImagePreview from "./ImagePreview";
import { Evidence } from "@interfaces";

interface Props {
  rows: Evidence[];
}

export default function HallazgosTable({ rows }: Props) {
  const [evidenceCurrent, setEvidenceCurrent] = useState<Evidence | null>(null);

  return (
    <>
      <ImagePreview
        isOpen={!!evidenceCurrent}
        setIsOpen={() => setEvidenceCurrent(null)}
        evidenceCurrent={evidenceCurrent}
      />
      <TableDefault
        rows={rows}
        headers={[
          "ID",
          "Planta",
          "Grupo",
          "Tipo de evidencia",
          "Zona",
          "Creado por",
          "Imagen",
          "Creación",
          "Ultima actualización",
        ]}
        paintRows={(row: Evidence) => (
          <StyledTableRow key={row.id}>
            <StyledTableCell component="th" scope="row">
              {row.id}
            </StyledTableCell>
            <StyledTableCell>{row.manufacturingPlant.name}</StyledTableCell>
            <StyledTableCell>{row.mainType.name}</StyledTableCell>
            <StyledTableCell>{row.secondaryType.name}</StyledTableCell>
            <StyledTableCell>{row.zone.name}</StyledTableCell>
            <StyledTableCell>
              {row.user.name} / {row.user.role}
            </StyledTableCell>
            <StyledTableCell>
              <Image
                src={baseUrlImage(row.imgEvidence)}
                alt="Evidencia de hallazgo"
                width={100}
                height={100}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setEvidenceCurrent(row)}
              />
            </StyledTableCell>
            <StyledTableCell>
              {stringToDateWithTime(row.createdAt)}
            </StyledTableCell>
            <StyledTableCell>
              {stringToDateWithTime(row.updatedAt)}
            </StyledTableCell>
          </StyledTableRow>
        )}
      />
    </>
  );
}
