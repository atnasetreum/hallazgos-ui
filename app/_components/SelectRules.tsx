import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Props {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  isFilter?: boolean;
}

const rules = ["Administrador", "General", "Supervisor"];

const SelectRules = ({ value, onChange, isFilter = false }: Props) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="manufacturing-plant-simple-select-label">
        Roles
      </InputLabel>
      <Select
        labelId="manufacturing-plant-simple-select-label"
        id="manufacturing-plant-simple-select"
        label="Planta"
        value={value}
        onChange={onChange}
      >
        {isFilter && <MenuItem value="">Ninguno</MenuItem>}
        {rules.map((rule) => (
          <MenuItem key={rule} value={rule}>
            {rule}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectRules;
