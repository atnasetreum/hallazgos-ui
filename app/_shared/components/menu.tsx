"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { ListItemButton } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ListSubheader } from "@mui/material";
import { List } from "@mui/material";
import { Collapse } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BusinessIcon from "@mui/icons-material/Business";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DnsIcon from "@mui/icons-material/Dns";
import HubIcon from "@mui/icons-material/Hub";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Tooltip } from "@mui/material";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningIcon from "@mui/icons-material/Warning";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FolderIcon from "@mui/icons-material/Folder";
import ConstructionIcon from "@mui/icons-material/Construction";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";

import { useCategoriesStore, useUserSessionStore } from "@store";
import { ROLE_ADMINISTRADOR } from "@shared/constants";
import { notify } from "@shared/utils";
import {
  AuthService,
  MainTypesService,
  ProcessesService,
  ZonesService,
} from "@services";

const userEpp = ["malonso@hadainternational.com"];

function CreateLink({
  url,
  title,
  icon,
  nested = false,
}: {
  url: string;
  title: string;
  icon: ReactNode;
  nested?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Tooltip title={title} placement="right">
      <ListItemButton
        onClick={() => router.push(url)}
        selected={pathname.startsWith(url)}
        sx={nested ? { pl: 4 } : undefined}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </Tooltip>
  );
}

export const MainListItems = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);

  const role = useUserSessionStore((state) => state.role);
  const email = useUserSessionStore((state) => state.email);

  const { setCategories } = useCategoriesStore();

  const initialCategories = useCallback(async () => {
    const [mainTypes, zones, processes] = await Promise.all([
      MainTypesService.findAll({}),
      ZonesService.findAll({}),
      ProcessesService.findAll({}),
    ]);

    setCategories({
      mainTypes,
      zones,
      processes,
    });
  }, [setCategories]);

  useEffect(() => {
    initialCategories();
  }, [initialCategories]);

  useEffect(() => {
    if (role && role === ROLE_ADMINISTRADOR && !isAdmin) {
      setIsAdmin(true);
    }
  }, [role, isAdmin]);

  if (email === "cosmeticostrujillo0023@gmail.com")
    return <CreateLink url="/hds" title="HDS" icon={<FolderIcon />} />;

  return (
    <>
      <CreateLink url="/dashboard" title="Dashboard" icon={<DashboardIcon />} />
      <CreateLink
        url="/hallazgos"
        title="Hallazgos"
        icon={<AssignmentIcon />}
      />
      <CreateLink url="/ics" title="ICS" icon={<FactCheckIcon />} />
      {(isAdmin || userEpp.includes(email)) && (
        <>
          {isAdmin && (
            <>
              <Tooltip title="Configuraciones" placement="right">
                <ListItemButton onClick={() => setOpenConfig((prev) => !prev)}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Configuraciones" />
                  {openConfig ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </Tooltip>
              <Collapse in={openConfig} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <CreateLink
                    nested
                    url="/users"
                    title="Usuarios"
                    icon={<SupervisedUserCircleIcon />}
                  />
                  <CreateLink
                    nested
                    url="/employees"
                    title="Colaboradores"
                    icon={<FolderSharedIcon />}
                  />
                  <CreateLink
                    nested
                    url="/manufacturing-plants"
                    title="Plantas"
                    icon={<BusinessIcon />}
                  />
                  <CreateLink
                    nested
                    url="/main-types"
                    title="Criterios"
                    icon={<EngineeringIcon />}
                  />
                  <CreateLink
                    nested
                    url="/secondary-types"
                    title="Tipos de criterios"
                    icon={<DnsIcon />}
                  />
                  <CreateLink
                    nested
                    url="/zones"
                    title="Zonas"
                    icon={<HubIcon />}
                  />
                  <CreateLink
                    nested
                    url="/processes"
                    title="Procesos"
                    icon={<AccountTreeIcon />}
                  />
                  <CreateLink
                    nested
                    url="/topics-tg"
                    title="Temas - G. Entr."
                    icon={<ContentPasteIcon />}
                  />
                  <CreateLink
                    nested
                    url="/config-tg"
                    title="Config - G. Entr."
                    icon={<ContentPasteIcon />}
                  />
                  <CreateLink
                    nested
                    url="/equipments"
                    title="Equipo de protección"
                    icon={<ConstructionIcon />}
                  />
                  <CreateLink
                    nested
                    url="/emergency-teams"
                    title="Equipos de emergencia"
                    icon={<FireExtinguisherIcon />}
                  />
                </List>
              </Collapse>
            </>
          )}
          <CreateLink url="/epp" title="EPP" icon={<DescriptionIcon />} />
          <CreateLink url="/ciael" title="CIAEL" icon={<WarningIcon />} />
          <CreateLink
            url="/extinguisher-inspection"
            title="Inspección de extintores"
            icon={<FireExtinguisherIcon />}
          />
        </>
      )}
      {!userEpp.includes(email) && (
        <>
          <CreateLink
            url="/training-guide"
            title="G. Entr."
            icon={<ContentPasteIcon />}
          />
          <CreateLink url="/hds" title="HDS" icon={<FolderIcon />} />
        </>
      )}
    </>
  );
};

export const SecondaryListItems = () => {
  const router = useRouter();
  const { resetSession } = useUserSessionStore();

  return (
    <>
      <ListSubheader component="div" inset>
        BI
      </ListSubheader>
      <CreateLink
        url="/business-intelligence/epp"
        title="Epp"
        icon={<BarChartIcon />}
      />
      <ListItemButton
        onClick={() => {
          AuthService.logout().then(({ message }) => {
            notify(message, true);
            router.push("/");
            setTimeout(() => {
              resetSession();
            }, 1000);
          });
        }}
      >
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Salir" />
      </ListItemButton>
    </>
  );
};
