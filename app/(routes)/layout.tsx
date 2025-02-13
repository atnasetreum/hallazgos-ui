"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Highcharts from "highcharts";

import { MainListItems, SecondaryListItems } from "@shared/components/menu";
import Copyright from "@shared/components/Copyright";
import { useUserSessionStore } from "@store";
import { UsersService } from "@services";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const ColorModeContext = createContext({ toggleColorMode: () => {} });

function BtnChangeMode() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const pathname = usePathname();

  const modeCurrent = theme.palette.mode;

  const isLight = modeCurrent === "light";
  const isDark = modeCurrent === "dark";

  useEffect(() => {
    if (isDark) {
      Highcharts.setOptions({
        chart: {
          backgroundColor: "#303030",
        },
        title: {
          style: {
            color: "#fff",
          },
        },
        subtitle: {
          style: {
            color: "#fff",
          },
        },
        colors: [
          "#f45b5b",
          "#8085e9",
          "#8d4654",
          "#7798BF",
          "#aaeeee",
          "#ff0066",
          "#eeaaee",
          "#55BF3B",
          "#DF5353",
          "#7798BF",
          "#aaeeee",
        ],
      });
    } else if (isLight) {
      Highcharts.setOptions({
        chart: {
          backgroundColor: "#fff",
        },
        title: {
          style: {
            color: "#000",
          },
        },
        subtitle: {
          style: {
            color: "#000",
          },
        },
        colors: [
          "#7cb5ec",
          "#434348",
          "#90ed7d",
          "#f7a35c",
          "#8085e9",
          "#f15c80",
          "#e4d354",
          "#2b908f",
          "#f45b5b",
          "#91e8e1",
          "#aaeeee",
        ],
      });
    }
  }, [modeCurrent, isDark, isLight]);

  const handleToggleColorMode = () => {
    colorMode.toggleColorMode();
    localStorage.setItem("colorMode", isLight ? "dark" : "light");
    if (pathname === "/dashboard") {
      window.location.reload();
    }
  };

  return (
    <IconButton sx={{ ml: 1 }} onClick={handleToggleColorMode} color="inherit">
      {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [open, setOpen] = useState(false);

  const { id: userId, name, setSession } = useUserSessionStore();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!userId) {
      UsersService.getInformationCurrentUser().then((user) => {
        const { manufacturingPlants } = user;
        setSession({
          ...user,
          manufacturingPlantsCurrent:
            manufacturingPlants.length === 1 ? [manufacturingPlants[0].id] : [],
        });
      });
    }
  }, [userId, setSession]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const lightTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#71BF44",
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#71BF44",
      },
    },
  });

  const theme = useMemo(
    () => createTheme(mode === "light" ? lightTheme : darkTheme),
    [mode, lightTheme, darkTheme]
  );

  useEffect(() => {
    const colorModeCurrent = localStorage.getItem("colorMode") as
      | "light"
      | "dark";
    if (colorModeCurrent) {
      setMode(colorModeCurrent);
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px",
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {name}
              </Typography>
              {/* <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
              <BtnChangeMode />
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <MainListItems />
              <Divider sx={{ my: 1 }} />
              <SecondaryListItems />
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
              {children}
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
