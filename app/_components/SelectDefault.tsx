import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

interface Props {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  data: any[];
  label: string;
  isFilter?: boolean;
  helperText?: string;
  attention?: string;
}

export default function SelectDefault({
  value,
  onChange,
  data,
  label,
  isFilter = false,
  helperText,
  attention,
}: Props) {
  return (
    <Paper>
      <FormControl fullWidth>
        <InputLabel id={`${label}-simple-select-helper-label`}>
          {label}
        </InputLabel>
        <Select
          labelId={`${label}-simple-select-helper-label`}
          id={`${label}-simple-select-helper`}
          value={value}
          label={label}
          onChange={onChange}
          disabled={!!helperText}
        >
          {isFilter && (
            <MenuItem value="">
              <em>Ninguno</em>
            </MenuItem>
          )}

          {data.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {attention && <FormHelperText>{attention}</FormHelperText>}
      </FormControl>
    </Paper>
  );
}
