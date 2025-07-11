import * as React from "react";

import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

import { ZonesService } from "@services";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface Props {
  values: string[];
  onChange: (values: string[]) => void;
  manufacturingPlantNames: string[];
}

export default function MultiSelectZones({
  values,
  onChange,
  manufacturingPlantNames,
}: Props) {
  const theme = useTheme();
  const [names, setNames] = React.useState<string[]>([]);
  const [labelSelectAll, setLabelSelectAll] = React.useState("Todos");

  React.useEffect(() => {
    ZonesService.findAll({
      manufacturingPlantNames,
    }).then((zones) => {
      setNames(
        zones.map((zone) => `${zone.manufacturingPlant.name} - ${zone.name}`)
      );
    });
  }, [manufacturingPlantNames]);

  React.useEffect(() => {
    if (!values.length) {
      setLabelSelectAll("Todos");
    } else if (values.length === names.length) {
      setLabelSelectAll("Ninguno");
    } else {
      setLabelSelectAll("Todos");
    }
  }, [values, names]);

  React.useEffect(() => {
    if (!manufacturingPlantNames.length) return onChange([]);

    const zonesFiltered = values.filter((value) => {
      const [manufacturingPlantName] = value.split(" - ");
      return manufacturingPlantNames.includes(manufacturingPlantName);
    });

    onChange(zonesFiltered);
  }, [manufacturingPlantNames]);

  const handleChange = ({
    target: { value },
  }: SelectChangeEvent<typeof values>) => {
    if (value.includes("none-all")) {
      if (values.length === names.length) {
        onChange([]);
        return;
      } else {
        onChange(names);
        return;
      }
    }
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="zones-multiple-chip-label">Zonas</InputLabel>
        <Select
          labelId="zones-multiple-chip-label"
          id="zones-multiple-chip"
          multiple
          value={values}
          onChange={handleChange}
          input={
            <OutlinedInput id="select-multiple-chip-zones" label="Zonas" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          <MenuItem value="none-all">{labelSelectAll}</MenuItem>
          {names
            .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
            .map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, values, theme)}
              >
                {name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
