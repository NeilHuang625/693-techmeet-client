import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Logout from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import {
  Avatar,
  Button,
  Box,
  Stack,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import { signup, logout, login } from "../Utils/API";
import { useAuth } from "../Contexts/AuthProvider";
import signupValidationSchema from "../models/signupValidationSchema";
import loginValidationSchema from "../models/loginValidationSchema";

const AccountMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, user, setUser, setJwt } =
    useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // for the Avatar Icon
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null); // for the custom button
  const open = Boolean(anchorEl);

  const [openSignupDialog, setOpenSignupDialog] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  // Signup form
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      nickname: "",
      confirmPassword: "",
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values, { setErrors, resetForm }) => {
      const { confirmPassword, ...rest } = values;
      try {
        const response = await signup(rest);
        const jwt = response.data.token.result;
        const resUser = response.data.user;
        setJwt(jwt);
        setIsAuthenticated(true);
        setUser(resUser);
        localStorage.setItem("jwt", jwt);
        setOpenSignupDialog(false);
        resetForm();
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setErrors({ email: "Email alreday in use, try a new one" });
        }
      }
    },
  });

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setErrors, resetForm }) => {
      try {
        const response = await login(values);
        const jwt = response.data.token.result;
        const resUser = response.data.user;
        setUser(resUser);
        localStorage.setItem("jwt", jwt);
        setOpenLoginDialog(false);
        setJwt(jwt);
        setIsAuthenticated(true);

        resetForm();
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setErrors({
            email: "Invalid email or password",
            password: "Invalid email or password",
          });
        }
      }
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    const jwt = localStorage.getItem("jwt");
    try {
      const response = await logout(jwt);
      if (response.status === 200) {
        localStorage.removeItem("jwt");
        setJwt(null);
        setIsAuthenticated(false);
        setUser(null);
        handleClose();
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            textAlign: "center",
          }}
        >
          <Button
            variant="text"
            color="inherit"
            aria-controls="event-button"
            aria-haspopup="true"
            onClick={(event) => setAnchorEl2(event.currentTarget)}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Event
          </Button>
          <Tooltip title="Account">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.nickname
                  ? user.nickname.substring(0, 2)
                  : user?.email.substring(0, 2)}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            textAlign: "center",
          }}
        >
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setOpenLoginDialog(true)}
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setOpenSignupDialog(true)}
            startIcon={<AppRegistrationIcon />}
          >
            Sign up
          </Button>
        </Stack>
      )}

      {/* Dialog for Signup */}
      <Dialog
        open={openSignupDialog}
        onClose={() => setOpenSignupDialog(false)}
      >
        <DialogTitle>
          Sign Up
          <IconButton
            style={{ position: "absolute", right: "30px", top: "10px" }}
            edge="end"
            color="inherit"
            onClick={() => setOpenSignupDialog(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
            />
            <TextField
              label="Nickname (optional)"
              id="nickname"
              name="nickname"
              margin="dense"
              onChange={formik.handleChange}
              value={formik.values.nickname}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              margin="dense"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              type="password"
              fullWidth
            />
            <Button type="submit" variant="text" style={{ marginTop: "30px" }}>
              Sign Up
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Login */}
      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
        <DialogTitle>
          Login
          <IconButton
            style={{ position: "absolute", right: "30px", top: "10px" }}
            edge="end"
            color="inherit"
            onClick={() => setOpenLoginDialog(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={loginForm.handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="dense"
              id="loginemail"
              name="email"
              value={loginForm.values.email}
              onChange={loginForm.handleChange}
              error={loginForm.touched.email && Boolean(loginForm.errors.email)}
              helperText={loginForm.touched.email && loginForm.errors.email}
            />
            <TextField
              fullWidth
              label="Password"
              id="loginPassword"
              name="password"
              value={loginForm.values.password}
              onChange={loginForm.handleChange}
              error={
                loginForm.touched.password && Boolean(loginForm.errors.password)
              }
              type="password"
              margin="dense"
              helperText={
                loginForm.touched.password && loginForm.errors.password
              }
            />
            <Button type="submit" variant="text" style={{ marginTop: "30px" }}>
              Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Menu
        id="event-button"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
      >
        {user?.roles && ["vip", "admin"].includes(user.roles) && (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/create-event");
            }}
          >
            <AddIcon fontSize="inherit" />
            Create
          </MenuItem>
        )}

        <MenuItem>
          <VisibilityIcon fontSize="inherit" />
          View Events
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/edit-events");
          }}
        >
          <EditIcon fontSize="inherit" />
          Edit Events
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
