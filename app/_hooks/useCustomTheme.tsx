import { useTheme } from "@mui/material/styles";

const useCustomTheme = () => {
  const theme = useTheme();

  return {
    colorText:
      theme.palette.mode !== "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
  };
};

export default useCustomTheme;
