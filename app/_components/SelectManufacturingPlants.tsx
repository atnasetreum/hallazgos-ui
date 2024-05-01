import { useEffect, useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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
  const [manufacturingPlants, setmanufacturingPlants] = useState<
    ManufacturingPlant[]
  >([]);

  useEffect(() => {
    ManufacturingPlantsService.findAll({}).then(setmanufacturingPlants);
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
          <MenuItem key={manufacturingPlant.id} value={manufacturingPlant.id}>
            {manufacturingPlant.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectManufacturingPlants;
