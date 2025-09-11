"use client";

import { useEffect, useState } from "react";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SwipeableViews from "react-swipeable-views";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { TopUsersByPlantData } from "@interfaces";
import { DashboardService } from "@services";
import {
  a11yProps,
  TabPanel,
} from "@routes/hallazgos/_components/TabsImageAndLogs";

export const TopUsersByPlantChart = () => {
  const [data, setData] = useState([] as TopUsersByPlantData[]);
  const [value, setValue] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    DashboardService.findTopUsersByPlant().then(setData);
  }, []);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  if (!Object.keys(data).length) return null;

  return (
    <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
      <ListItemButton>
        <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
        <ListItemText
          sx={{ my: 0 }}
          primary={`Usuarios con más hallazgos`}
          primaryTypographyProps={{
            fontSize: 20,
            fontWeight: "medium",
            letterSpacing: 0,
          }}
        />
      </ListItemButton>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {data.map((item, idx) => (
            <Tab
              key={`${item.name}-${idx}`}
              label={item.name}
              {...a11yProps(idx)}
            />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {data.map((item, idx) => (
          <TabPanel
            key={`${item.name}_${idx}`}
            value={value}
            index={idx}
            dir={theme.direction}
          >
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {item.data.map((user, idx) => (
                <Box key={`${user.username}${idx}`}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Hallazgos creados: <b>{user.total}</b>
                      </Typography>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText primary={user.username} />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Box>
              ))}
            </List>
          </TabPanel>
        ))}
      </SwipeableViews>
    </Box>
  );
};
