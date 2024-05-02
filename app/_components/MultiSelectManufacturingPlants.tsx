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

  React.useEffect(() => {
    ManufacturingPlantsService.findAll({}).then((manufacturingPlants) =>
      setNames(manufacturingPlants.map((plant) => plant.name))
    );
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof values>) => {
    const {
      target: { value },
    } = event;
    onChange(typeof value === "string" ? value.split(",") : value);
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
