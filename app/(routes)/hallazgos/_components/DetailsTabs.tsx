import * as React from "react";

import Image from "next/image";

import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PartyModeIcon from "@mui/icons-material/PartyMode";
import SaveIcon from "@mui/icons-material/Save";
import Camera from "react-html5-camera-photo";
import { v4 as uuidv4 } from "uuid";

import {
  baseUrlImage,
  dataURLtoFile,
  notify,
  stringToDateWithTime,
} from "@shared/utils";
import { Evidence } from "@interfaces";
import { EvidencesService, handleErrorResponse } from "@services";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

interface Props {
  evidenceCurrent: Evidence;
  handleClose: (refresh?: boolean) => void;
}
export default function DetailsTabs({ evidenceCurrent, handleClose }: Props) {
  const [value, setValue] = React.useState<number>(0);
  const [image, setImage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const theme = useTheme();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const saveSolution = () => {
    const formData = new FormData();

    const uuid = uuidv4();

    formData.append("file", dataURLtoFile(image, `${uuid}-solution.png`));

    setIsLoading(true);
    EvidencesService.solution(evidenceCurrent.id, formData)
      .then(() => {
        notify("Hallazgo creado correctamente", true);
        handleClose(true);
      })
      .catch(handleErrorResponse)
      .finally(() => setIsLoading(false));
  };

  return (
    <Box sx={{ bgcolor: "background.paper", p: 3 }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Hallazgo" {...a11yProps(0)} />
          <Tab label="Solución" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
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
                            color: theme.palette.primary.main,
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
            <Grid item xs={12} sm={6} md={6}>
              <Image
                src={baseUrlImage(evidenceCurrent?.imgEvidence || "")}
                alt="Evidencia de hallazgo"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid item xs={12} sm={12} md={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Paper sx={{ p: 2 }}>
                {!image ? (
                  <Camera onTakePhoto={(dataUri) => setImage(dataUri)} />
                ) : (
                  <>
                    <Image
                      src={image}
                      alt="Evidencia de hallazgo"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="inherit"
                          startIcon={<PartyModeIcon />}
                          onClick={() => setImage("")}
                          disabled={isLoading}
                        >
                          Volver a tomar evidencia
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={() => saveSolution()}
                          disabled={isLoading}
                        >
                          Guardar evidencia
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Paper>
            </Box>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
