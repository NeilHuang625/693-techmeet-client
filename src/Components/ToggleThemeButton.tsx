import { Box, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

interface ToggleThemeButtonProps {
  theme: string;
  toggleTheme: () => void;
}

const toggleThemeButton: React.FC<ToggleThemeButtonProps> = ({
  theme,
  toggleTheme,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
        p: 3,
      }}
    >
      {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
      <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
        {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
};

export default toggleThemeButton;
