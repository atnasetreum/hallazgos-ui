import * as React from "react";

import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

import { ManufacturingPlantsService } from "@services";

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
}

export default function MultiSelectManufacturingPlants({
  values,
  onChange,
}: Props) {
  const theme = useTheme();
  const [names, setNames] = React.useState<string[]>([]);
  const [labelSelectAll, setLabelSelectAll] = React.useState("Todos");

  React.useEffect(() => {
    ManufacturingPlantsService.findAll({}).then((manufacturingPlants) =>
      setNames(manufacturingPlants.map((plant) => plant.name))
    );
  }, []);

  React.useEffect(() => {
    if (!values.length) {
      setLabelSelectAll("Todos");
    } else if (values.length === names.length) {
      setLabelSelectAll("Ninguno");
    } else {
      setLabelSelectAll("Todos");
    }
  }, [values, names]);

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
    onChange(
      typeof value === "string" ? value.split(",") : (value as string[])
    );
  };

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="manufacturing-plants-multiple-chip-label">
          Plantas
        </InputLabel>
        <Select
          labelId="manufacturing-plants-multiple-chip-label"
          id="manufacturing-plants-multiple-chip"
          multiple
          value={values}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Plantas" />}
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
