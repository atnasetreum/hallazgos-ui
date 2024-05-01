import { useEffect, useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { ZonesService } from "@services";
import { Zone } from "@interfaces";

interface Props {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  isFilter?: boolean;
  manufacturingPlantId: string;
}

const SelectZones = ({
  value,
  onChange,
  isFilter = false,
  manufacturingPlantId,
}: Props) => {
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    if (!manufacturingPlantId) return;
    ZonesService.findAll({
      manufacturingPlantId: manufacturingPlantId,
    }).then(setZones);
  }, [manufacturingPlantId]);

  return (
    <FormControl fullWidth>
      <InputLabel id="zone-simple-select-label">Zonas</InputLabel>
      <Select
        labelId="zone-simple-select-label"
        id="zone-simple-select"
        label="Zonas"
        value={value}
        onChange={onChange}
        disabled={!manufacturingPlantId}
      >
        {isFilter && <MenuItem value="">Ninguna</MenuItem>}
        {zones.map((zone) => (
          <MenuItem key={zone.id} value={zone.id}>
            {zone.name}
          </MenuItem>
        ))}
      </Select>
      {!manufacturingPlantId && (
        <FormHelperText>Seleccione una planta</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectZones;
