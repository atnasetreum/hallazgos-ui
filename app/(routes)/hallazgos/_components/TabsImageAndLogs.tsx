import { ReactNode, SyntheticEvent, useEffect, useState } from "react";

import Image from "next/image";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SwipeableViews from "react-swipeable-views";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { CommentEvidenceGraphql, EvidenceGraphql } from "@hooks";
import { baseUrlImage, notify } from "@shared/utils";
import { EvidencesService } from "@services";
import ListComments from "./ListComments";

interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

interface Props {
  evidenceCurrent: EvidenceGraphql;
  setRefreshData: (refreshData: boolean) => void;
  withImages: boolean;
}

export default function TabsImageAndLogs({
  evidenceCurrent,
  setRefreshData,
  withImages,
}: Props) {
  const theme = useTheme();
  const [value, setValue] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentEvidenceGraphql[]>(
    evidenceCurrent.comments
  );

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  useEffect(() => {
    setRefreshData(false);
  }, [setRefreshData]);

  const addComment = () => {
    EvidencesService.addComment(evidenceCurrent.id, comment).then((data) => {
      setComment("");
      notify("Comentario agregado correctamente", true);
      setComments(data.comments);
      setRefreshData(true);
    });
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {withImages && <Tab label="Imagenes" {...a11yProps(0)} />}
          <Tab
            label={`Comentarios (${comments.length})`}
            {...a11yProps(withImages ? 1 : 0)}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {withImages && (
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container spacing={3}>
              {evidenceCurrent?.imgEvidence && (
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
                    src={baseUrlImage(evidenceCurrent.imgEvidence || "")}
                    alt="Hallazgo imagen"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Grid>
              )}

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
          </TabPanel>
        )}
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={10} md={10}>
              <TextField
                label="Commentario"
                variant="outlined"
                fullWidth
                autoComplete="off"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2} md={2}>
              <Button
                variant="contained"
                startIcon={<QuestionAnswerIcon />}
                fullWidth
                onClick={addComment}
              >
                Agregar
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              {!!comments.length && <ListComments comments={comments} />}
            </Grid>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
