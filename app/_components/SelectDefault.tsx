import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
//import FormHelperText from "@mui/material/FormHelperText";

interface Props {
  value: string;
  onChange: (event: any, newValue: any) => void;
  data: any[];
  label: string;
  isFilter?: boolean;
  helperText?: string;
  attention?: string;
  validationEmpty?: boolean;
  disabled?: boolean;
  name?: string;
}

export default function SelectDefault({
  value,
  onChange,
  data,
  label,
  isFilter = false,
  helperText,
  attention,
  validationEmpty = false,
  disabled = false,
  name = "",
}: Props) {
  const selectedOption = data.find((item) => String(item.id) === value) || null;

  return (
    <Paper>
      <Autocomplete
        fullWidth
        value={selectedOption}
        onChange={(_, newValue) => {
          // Crear un objeto similar a SelectChangeEvent para mantener compatibilidad
          const syntheticEvent = {
            target: {
              value: newValue ? String(newValue.id) : "",
              name: name,
            },
          };
          onChange(syntheticEvent as any, newValue);
        }}
        options={data}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        disabled={!!helperText || disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!validationEmpty ? false : value === "" ? true : false}
            helperText={helperText || attention}
            name={name}
          />
        )}
        noOptionsText="No hay opciones"
        clearText="Limpiar"
        openText="Abrir"
        closeText="Cerrar"
        {...(isFilter && { clearOnEscape: true })}
      />
    </Paper>
  );
}

/* import Paper from "@mui/material/Paper";
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
  validationEmpty?: boolean;
  disabled?: boolean;
  name?: string;
}

export default function SelectDefault({
  value,
  onChange,
  data,
  label,
  isFilter = false,
  helperText,
  attention,
  validationEmpty = false,
  disabled = false,
  name = "",
}: Props) {
  return (
    <Paper>
      <FormControl
        fullWidth
        error={!validationEmpty ? false : value === "" ? true : false}
      >
        <InputLabel id={`${label}-simple-select-helper-label`}>
          {label}
        </InputLabel>
        <Select
          labelId={`${label}-simple-select-helper-label`}
          id={`${label}-simple-select-helper`}
          value={value}
          label={label}
          onChange={onChange}
          disabled={!!helperText || disabled}
          name={name}
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
} */
