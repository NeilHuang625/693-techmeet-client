import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Notification from "./Notification";
import Message from "./Message";
import Logout from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { toast } from "react-toastify";
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
  Divider,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { signup, logout, login } from "../Utils/API";
import { useAuth } from "../Contexts/AuthProvider";
import { AppContext } from "../App";
import signupValidationSchema from "../models/signupValidationSchema";
import loginValidationSchema from "../models/loginValidationSchema";

const AccountMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, user, setUser, setJwt } =
    useAuth();
  const { openLoginDialog, setOpenLoginDialog } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // for the Avatar Icon
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null); // for the custom button
  const open = Boolean(anchorEl);

  const [openSignupDialog, setOpenSignupDialog] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Signup form
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      nickname: "",
      confirmPassword: "",
      imageFile: null,
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values, { setErrors, resetForm }) => {
      const { confirmPassword, imageFile, ...rest } = values;
      const formData = new FormData();

      for (const key in rest) {
        formData.append(key, rest[key]);
      }

      formData.append("imageFile", imageFile as File);

      try {
        const response = await signup(formData);
        const jwt = response.data.token.result;
        const resUser = response.data.user;
        setJwt(jwt);
        setIsAuthenticated(true);
        setUser(resUser);
        localStorage.setItem("jwt", jwt);
        setOpenSignupDialog(false);
        resetForm();
        toast.success("Signup successfully");
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
        toast.success("Login successfully");
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
        toast.success("Logout successfully");
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
            gap: "8px",
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
          <Message />
          <Notification />
          <Tooltip title="Account">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{ width: 42, height: 42 }}
                src={user?.profileImageUrl}
              />
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
            variant="text"
            onClick={() => setOpenLoginDialog(true)}
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
          <Button
            color="inherit"
            variant="text"
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
              error={formik.touched.nickname && Boolean(formik.errors.nickname)}
              fullWidth
              helperText={formik.touched.nickname && formik.errors.nickname}
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
            <div
              className={`flex border border-gray-300 rounded mt-2 pl-3 py-1 space-x-32 ${
                formik.touched.imageFile && formik.errors.imageFile
                  ? "border-red-500"
                  : ""
              }`}
            >
              <div className="flex flex-col">
                <InputLabel className="w-[108px] my-2" htmlFor="imageFile">
                  Profile Image
                </InputLabel>
                <Input
                  className="w-[250px]"
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  onChange={(e) => {
                    const target = e.currentTarget as HTMLInputElement;
                    const file: File = (target.files as FileList)[0];
                    if (file) {
                      formik.setFieldValue("imageFile", file);
                      const url = URL.createObjectURL(file);
                      setImagePreviewUrl(url);
                    } else {
                      formik.setFieldValue("imageFile", null);
                      setImagePreviewUrl(null);
                    }
                  }}
                  error={
                    formik.touched.imageFile && Boolean(formik.errors.imageFile)
                  }
                />
                {formik.touched.imageFile && formik.errors.imageFile && (
                  <FormHelperText error>
                    {formik.errors.imageFile}
                  </FormHelperText>
                )}
              </div>
              <div className="w-[100px] h-[100px]">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Profile Photo"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100px",
                      height: "100px",
                      border: "1px dashed gray",
                      backgroundColor: "#e2e8f0",
                    }}
                  />
                )}
              </div>
            </div>
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
            Create Event
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/events-attending");
          }}
        >
          <VisibilityIcon fontSize="inherit" />
          Events Attending
        </MenuItem>
        {user?.roles && ["vip", "admin"].includes(user.roles) && (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/events-posted");
            }}
          >
            <EditIcon fontSize="inherit" />
            Events Posted
          </MenuItem>
        )}
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
        <MenuItem>
          <ListItemIcon>
            <MailOutlineIcon fontSize="small" />
          </ListItemIcon>
          {user?.email}
        </MenuItem>
        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          View profile
        </MenuItem>
        <Divider />
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
