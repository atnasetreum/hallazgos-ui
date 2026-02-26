import { ReactNode, SyntheticEvent, useEffect, useState } from "react";

import Image from "next/image";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { AppBar } from "@mui/material";
import { Grid } from "@mui/material";
import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";
import { Box } from "@mui/material";

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
    evidenceCurrent.comments,
  );

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
          scrollButtons="auto"
          aria-label="full width tabs example"
        >
          {withImages && <Tab label="Imagenes" {...a11yProps(0)} />}
          <Tab
            label={`Comentarios (${comments.length})`}
            {...a11yProps(withImages ? 1 : 0)}
          />
        </Tabs>
      </AppBar>
      {withImages && value === 0 && (
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={3}>
            {evidenceCurrent?.imgEvidence && (
              <Grid
                size={{
                  xs: 12,
                  sm: evidenceCurrent.imgSolution ? 6 : 12,
                  md: evidenceCurrent.imgSolution ? 6 : 12,
                }}
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
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 6,
                }}
              >
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

      {((withImages && value === 1) || (!withImages && value === 0)) && (
        <TabPanel
          value={value}
          index={withImages ? 1 : 0}
          dir={theme.direction}
        >
          {/* ...contenido de comentarios... */}
          <ListComments comments={comments} />
          <Box sx={{ display: "flex", mt: 2 }}>
            <TextField
              fullWidth
              label="Agregar comentario"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
            />
            <Button
              sx={{ ml: 2 }}
              variant="contained"
              onClick={addComment}
              disabled={!comment.trim()}
              startIcon={<QuestionAnswerIcon />}
            >
              Comentar
            </Button>
          </Box>
        </TabPanel>
      )}
    </Box>
  );
}
