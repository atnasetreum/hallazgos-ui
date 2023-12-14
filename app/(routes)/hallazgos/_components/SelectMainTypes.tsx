import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useUserSessionStore } from "@store";

interface Props {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

export default function SelectMainTypes({ value, onChange }: Props) {
  const manufacturingPlants = useUserSessionStore(
    (state) => state.manufacturingPlants
  );

  return (
    <Paper>
      <FormControl fullWidth>
        <InputLabel id="plants-simple-select-helper-label">Planta</InputLabel>
        <Select
          labelId="plants-simple-select-helper-label"
          id="plants-simple-select-helper"
          value={value}
          label="Planta"
          onChange={onChange}
        >
          <MenuItem value="">
            <em>Ninguna</em>
          </MenuItem>
          {manufacturingPlants.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
}
