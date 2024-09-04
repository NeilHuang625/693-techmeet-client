import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Typography, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AccountMenu from "./AccountMenu";
import ToggleThemeButton from "./ToggleThemeButton";
import { useTheme } from "../Contexts/ThemeProvider";
import { useAuth } from "../Contexts/AuthProvider";
import UpgradeDialog from "./Dialogs/UpgradeDialog";
import PaymentDialog from "./Dialogs/PaymentDialog";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const role = user?.roles;
  const [search, setSearch] = useState("");
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  };

  const handleUpgradeClick = () => {
    setOpenUpgradeDialog(false);
    setOpenPaymentDialog(true);
  };

  return (
    <Box
      borderBottom={1}
      borderColor="#bdbdbd"
      boxShadow={3}
      borderRadius={3}
      height="80px"
      display="flex"
      alignItems="center"
    >
      <Grid container spacing={2} alignItems="center" style={{ width: "100%" }}>
        {/* Logo */}
        <Grid container size={3}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingLeft={2}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", width: "90%" }}
          >
            <img
              src="src/assets/logo.jpeg"
              style={{
                width: "100%",
                height: "70px",
                borderBottomLeftRadius: "10px",
              }}
              alt="logo"
            />
          </Box>
        </Grid>
        {/* Search bar */}
        <Grid size={4}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "80%",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Events"
              inputProps={{ "aria-label": "search events" }}
              value={search}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        {role === "user" ? (
          <Grid size={2} container justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => setOpenUpgradeDialog(true)}
            >
              Upgrade to VIP
            </Button>
            <UpgradeDialog
              open={openUpgradeDialog}
              onClose={() => setOpenUpgradeDialog(false)}
              handleUpgrade={handleUpgradeClick}
            />
            <PaymentDialog
              open={openPaymentDialog}
              onClose={() => setOpenPaymentDialog(false)}
            />
          </Grid>
        ) : (
          <Grid size={2}>
            {/* This is an empty Grid item to take up the remaining space */}
          </Grid>
        )}

        <Grid size={2}>
          <AccountMenu />
        </Grid>
        <Grid size={1}>
          <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NavBar;
