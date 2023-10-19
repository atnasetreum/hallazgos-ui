"use client";

import * as React from "react";

import { usePathname, useRouter } from "next/navigation";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import BusinessIcon from "@mui/icons-material/Business";
import FolderIcon from "@mui/icons-material/Folder";
import FolderSharedIcon from "@mui/icons-material/FolderShared";

import { AuthService } from "@services";
import { notify } from "@shared/utils";
import { useUserSessionStore } from "@store";

function CreateLink({
  url,
  title,
  icon,
}: {
  url: string;
  title: string;
  icon: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ListItemButton
      onClick={() => router.push(url)}
      selected={pathname.startsWith(url)}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  );
}

export const MainListItems = () => {
  const [isAdmin, setIsAdmin] = React.useState(false);

  const role = useUserSessionStore((state) => state.role);

  React.useEffect(() => {
    if (role && role === "admin" && !isAdmin) {
      setIsAdmin(true);
    }
  }, [role, isAdmin]);

  return (
    <React.Fragment>
      <CreateLink url="/dashboard" title="Dashboard" icon={<DashboardIcon />} />
      <CreateLink
        url="/hallazgos"
        title="Hallazgos"
        icon={<AssignmentIcon />}
      />
      {isAdmin && (
        <React.Fragment>
          <CreateLink
            url="/usuarios"
            title="Usuarios"
            icon={<SupervisedUserCircleIcon />}
          />
          <CreateLink
            url="/usuarios"
            title="Tipos de evidencia"
            icon={<FolderIcon />}
          />
          <CreateLink
            url="/usuarios"
            title="Zonas"
            icon={<AssuredWorkloadIcon />}
          />
          <CreateLink
            url="/usuarios"
            title="Usuarios - Zonas"
            icon={<FolderSharedIcon />}
          />
          <CreateLink url="/usuarios" title="Plantas" icon={<BusinessIcon />} />
          <CreateLink
            url="/usuarios"
            title="Usuarios - Plantas"
            icon={<FolderSharedIcon />}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export const SecondaryListItems = () => {
  const router = useRouter();
  const { resetSession } = useUserSessionStore();

  return (
    <React.Fragment>
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
            resetSession();
            router.push("/");
          });
        }}
      >
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Salir" />
      </ListItemButton>
    </React.Fragment>
  );
};
