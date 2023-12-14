import Image from "next/image";

import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import {
  baseUrlImage,
  durantionToTime,
  stringToDateWithTime,
} from "@shared/utils";
import { Evidence } from "@interfaces";
import { STATUS_CLOSED, STATUS_OPEN } from "@shared/constants";

interface Props {
  evidenceCurrent: Evidence;
}

export default function DetailsTabs({ evidenceCurrent }: Props) {
  const theme = useTheme();

  return (
    <Grid container sx={{ p: 2 }}>
      <Grid item xs={12} sm={4} md={4}>
        <List dense={true}>
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={evidenceCurrent.manufacturingPlant.name}
                secondary="Planta"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={evidenceCurrent.mainType.name}
                secondary="Hallazgo"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={evidenceCurrent.secondaryType.name}
                secondary="Tipo de hallazgo"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={evidenceCurrent.zone.name}
                secondary="Zona"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={evidenceCurrent.status}
                secondary="Status"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    style={{
                      color:
                        evidenceCurrent.status === STATUS_OPEN
                          ? theme.palette.warning.main
                          : evidenceCurrent.status === STATUS_CLOSED
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      textDecoration: "underline",
                    }}
                  >
                    {evidenceCurrent.status}
                  </Typography>
                }
                secondary="Status"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={evidenceCurrent.user.name}
                secondary="Usuario que reporta"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={evidenceCurrent.supervisor.name}
                secondary="Supervisor asignado"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={stringToDateWithTime(evidenceCurrent.createdAt)}
                secondary="Fecha de creación"
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          {evidenceCurrent.solutionDate && (
            <ListItem sx={{ backgroundColor: theme.palette.primary.main }}>
              <ListItemButton>
                <ListItemText
                  primary={stringToDateWithTime(evidenceCurrent.solutionDate)}
                  secondary={`Fecha de cierre, tiempo de solución ${
                    evidenceCurrent.status === STATUS_CLOSED
                      ? durantionToTime(
                          evidenceCurrent.createdAt,
                          evidenceCurrent.solutionDate
                        )
                      : ""
                  }`}
                />
              </ListItemButton>
            </ListItem>
          )}
          <Divider />
          <ListItem>
            <ListItemButton>
              <ListItemText
                primary={stringToDateWithTime(evidenceCurrent.updatedAt)}
                secondary="Ultima actualización"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={8} md={8}>
        <Grid container sx={{ p: 2 }}>
          <Grid
            item
            xs={12}
            sm={evidenceCurrent.imgSolution ? 6 : 12}
            md={evidenceCurrent.imgSolution ? 6 : 12}
          >
            <Typography variant="h6" gutterBottom>
              Hallazgo
            </Typography>
            <Image
              src={baseUrlImage(evidenceCurrent?.imgEvidence || "")}
              alt="Imagen Hallazgo"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </Grid>
          {evidenceCurrent.imgSolution && (
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="h6" gutterBottom>
                Solución
              </Typography>
              <Image
                src={baseUrlImage(evidenceCurrent?.imgSolution || "")}
                alt="Imagen Solución"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
