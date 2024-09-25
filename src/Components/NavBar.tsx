import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AccountMenu from "./AccountMenu";
import ToggleThemeButton from "./ToggleThemeButton";
import { useTheme } from "../Contexts/ThemeProvider";
import { useAuth } from "../Contexts/AuthProvider";
import { AppContext } from "../App";
import UpgradeDialog from "./Dialogs/UpgradeDialog";
import PaymentDialog from "./Dialogs/PaymentDialog";
import logo from "../assets/logo.jpeg";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, jwt, isAuthenticated } = useAuth();
  const {
    setEvents,
    allEvents,
    setSelectedCategories,
    setSelectedCity,
    setSelectedRadio,
  } = useContext(AppContext);
  const role = user?.roles;
  const [search, setSearch] = useState("");
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    const filteredEvents = allEvents.filter((event) =>
      event.title.toLowerCase().includes(search.toLowerCase())
    );
    setEvents(filteredEvents);
    setSearch("");
    navigate("/");
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
            onClick={() => {
              setEvents(allEvents);
              setSelectedCategories([]);
              setSelectedCity("");
              setSelectedRadio("");
              navigate("/");
            }}
            style={{ cursor: "pointer", width: "90%" }}
          >
            <img
              className="transition transform hover:scale-105"
              src={logo}
              style={{
                width: "90%",
                height: "60px",
                objectFit: "contain",
              }}
              alt="logo"
            />
          </Box>
        </Grid>
        {/* Search bar */}
        <Grid size={3}>
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchClick();
              setSearch("");
            }}
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InputBase
              className="highlight-on-focus"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Events"
              inputProps={{ "aria-label": "search events" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton
              onClick={handleSearchClick}
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        {isAuthenticated && role === "user" ? (
          <Grid size={2} container justifyContent="center">
            <Button
              sx={{ borderRadius: "20px" }}
              variant="contained"
              color="info"
              onClick={() => setOpenUpgradeDialog(true)}
            >
              Upgrade to VIP
            </Button>
            <UpgradeDialog
              open={openUpgradeDialog}
              onClose={() => setOpenUpgradeDialog(false)}
              handleUpgrade={handleUpgradeClick}
              jwt={jwt}
            />
            <PaymentDialog
              open={openPaymentDialog}
              onClose={() => setOpenPaymentDialog(false)}
              jwt={jwt}
            />
          </Grid>
        ) : (
          <Grid size={2}>
            {/* This is an empty Grid item to take up the remaining space */}
          </Grid>
        )}

        <Grid size={3}>
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
