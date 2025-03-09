"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BusinessIcon from "@mui/icons-material/Business";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DnsIcon from "@mui/icons-material/Dns";
import HubIcon from "@mui/icons-material/Hub";
import Tooltip from "@mui/material/Tooltip";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

import { useCategoriesStore, useUserSessionStore } from "@store";
import { ROLE_ADMINISTRADOR } from "@shared/constants";
import { notify } from "@shared/utils";
import {
  AuthService,
  MainTypesService,
  TypeManagesService,
  ZonesService,
} from "@services";

function CreateLink({
  url,
  title,
  icon,
}: {
  url: string;
  title: string;
  icon: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Tooltip title={title} placement="right">
      <ListItemButton
        onClick={() => router.push(url)}
        selected={pathname.startsWith(url)}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </Tooltip>
  );
}

export const MainListItems = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const role = useUserSessionStore((state) => state.role);

  const { setCategories } = useCategoriesStore();

  const initialCategories = useCallback(async () => {
    const [mainTypes, zones, typeManages] = await Promise.all([
      MainTypesService.findAll({}),
      ZonesService.findAll({}),
      TypeManagesService.findAll(),
    ]);

    setCategories({
      mainTypes,
      zones,
      typeManages,
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

  return (
    <>
      <CreateLink url="/dashboard" title="Dashboard" icon={<DashboardIcon />} />
      <CreateLink
        url="/hallazgos"
        title="Hallazgos"
        icon={<AssignmentIcon />}
      />
      {isAdmin && (
        <>
          <CreateLink
            url="/manufacturing-plants"
            title="Plantas"
            icon={<BusinessIcon />}
          />
          <CreateLink
            url="/main-types"
            title="Criterios"
            icon={<EngineeringIcon />}
          />
          <CreateLink
            url="/secondary-types"
            title="Tipos de criterios"
            icon={<DnsIcon />}
          />
          <CreateLink url="/zones" title="Zonas" icon={<HubIcon />} />
          <CreateLink
            url="/users"
            title="Usuarios"
            icon={<SupervisedUserCircleIcon />}
          />
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
        Reportes
      </ListSubheader>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="BI" />
      </ListItemButton>
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
