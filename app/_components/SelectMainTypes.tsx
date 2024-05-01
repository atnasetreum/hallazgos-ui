import { useEffect, useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { MainTypesService } from "@services";
import { MainType } from "@interfaces";

interface Props {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  isFilter?: boolean;
}

const SelectMainTypes = ({ value, onChange, isFilter = false }: Props) => {
  const [mainTypes, setMainTypes] = useState<MainType[]>([]);

  useEffect(() => {
    MainTypesService.findAll({}).then(setMainTypes);
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="criterio-simple-select-label">Criterio</InputLabel>
      <Select
        labelId="criterio-simple-select-label"
        id="criterio-simple-select"
        label="Criterio"
        value={value}
        onChange={onChange}
      >
        {isFilter && <MenuItem value="">Ninguno</MenuItem>}
        {mainTypes.map((mainType) => (
          <MenuItem key={mainType.id} value={mainType.id}>
            {mainType.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectMainTypes;
