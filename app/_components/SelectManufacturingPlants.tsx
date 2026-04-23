import { useEffect, useState } from "react";

import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { FormControl } from "@mui/material";
import { Select, SelectChangeEvent } from "@mui/material";

import { ManufacturingPlantsService } from "@services";
import { ManufacturingPlant } from "@interfaces";

interface Props {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  isFilter?: boolean;
}

const SelectManufacturingPlants = ({
  value,
  onChange,
  isFilter = false,
}: Props) => {
  const [manufacturingPlants, setManufacturingPlants] = useState<
    ManufacturingPlant[]
  >([]);

  useEffect(() => {
    ManufacturingPlantsService.findAll({}).then(setManufacturingPlants);
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="manufacturing-plant-simple-select-label">
        Planta
      </InputLabel>
      <Select
        labelId="manufacturing-plant-simple-select-label"
        id="manufacturing-plant-simple-select"
        label="Planta"
        value={value}
        onChange={onChange}
      >
        {isFilter && <MenuItem value="">Ninguna</MenuItem>}
        {manufacturingPlants.map((manufacturingPlant) => (
          <MenuItem
            key={manufacturingPlant.id}
            value={String(manufacturingPlant.id)}
          >
            {manufacturingPlant.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectManufacturingPlants;
