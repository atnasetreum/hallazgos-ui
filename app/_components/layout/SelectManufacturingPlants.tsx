"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";

import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DomainIcon from "@mui/icons-material/Domain";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DomainDisabledIcon from "@mui/icons-material/DomainDisabled";
import Typography from "@mui/material/Typography";

import { useUserSessionStore } from "@store";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function SelectManufacturingPlants() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const open = Boolean(anchorEl);

  const manufacturingPlants = useUserSessionStore(
    (state) => state.manufacturingPlants
  );

  const manufacturingPlantsCurrent = useUserSessionStore(
    (state) => state.manufacturingPlantsCurrent
  );

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const titlePlantSelected = useMemo(() => {
    if (!isMounted) return "Cargando...";
    if (!manufacturingPlantsCurrent.length) return "Seleccionar planta";
    if (manufacturingPlantsCurrent.length === 1)
      return manufacturingPlants.find(
        (e) => e.id === manufacturingPlantsCurrent[0]
      )?.name;

    return `Plantas (${manufacturingPlantsCurrent.length})`;
  }, [isMounted, manufacturingPlantsCurrent, manufacturingPlants]);

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <Typography>{titlePlantSelected}</Typography>
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {manufacturingPlants.map((plant) => {
          const selected = manufacturingPlantsCurrent.includes(plant.id);
          return (
            <MenuItem
              key={plant.id}
              selected={selected}
              onClick={
                selected
                  ? () => {
                      useUserSessionStore.setState({
                        manufacturingPlantsCurrent:
                          manufacturingPlantsCurrent.filter(
                            (e) => e !== plant.id
                          ),
                      });
                    }
                  : () => {
                      useUserSessionStore.setState({
                        manufacturingPlantsCurrent: [
                          ...manufacturingPlantsCurrent,
                          plant.id,
                        ],
                      });
                    }
              }
            >
              {selected ? (
                <DomainIcon style={{ fill: "green" }} />
              ) : (
                <DomainDisabledIcon />
              )}
              {plant.name}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
}
