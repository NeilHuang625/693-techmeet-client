import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { signup, logout, login } from "../Utils/API";
import { useAuth } from "../Contexts/AuthProvider";

// Signup form validation
const signupValidationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .matches(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

// Login form validation
const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .matches(
      /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    )
    .required("Password is required"),
});

const AccountMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth, user, setUser } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // for the Avatar Icon
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null); // for the custom button
  const open = Boolean(anchorEl);

  const [openSignupDialog, setOpenSignupDialog] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  useEffect(() => {
    // Check the authentication status when the component mounts
    checkAuth();
  }, []);

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
        setUser(resUser);
        localStorage.setItem("jwt", jwt);
        setOpenSignupDialog(false);
        // Update the authentication status
        checkAuth();
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
        console.log("response", response);
        const jwt = response.data.token.result;
        const resUser = response.data.user;
        setUser(resUser);
        localStorage.setItem("jwt", jwt);
        setOpenLoginDialog(false);
        checkAuth();
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
  console.log("isAuthenticated", isAuthenticated);

  const handleLogout = async () => {
    const jwt = localStorage.getItem("jwt");
    try {
      const response = await logout(jwt);

      if (response.status === 200) {
        localStorage.removeItem("jwt");
        checkAuth();
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            textAlign: "center",
          }}
        >
          <Button
            color="inherit"
            variant="text"
            onClick={() => setOpenLoginDialog(true)}
          >
            Login
          </Button>
          <Button
            color="inherit"
            variant="text"
            onClick={() => setOpenSignupDialog(true)}
          >
            Sign up
          </Button>
        </Box>
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
            <Button
              color="primary"
              type="submit"
              variant="contained"
              style={{ marginTop: "30px" }}
            >
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
            <Button
              color="primary"
              type="submit"
              variant="contained"
              style={{ marginTop: "30px" }}
            >
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
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/create-event");
          }}
        >
          <AddIcon fontSize="inherit" />
          Create
        </MenuItem>
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
