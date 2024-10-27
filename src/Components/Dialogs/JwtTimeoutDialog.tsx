import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../../Contexts/AuthProvider";

const JwtTimeoutDialog = () => {
  const { isExtendDialogOpen, handleLogout, handleJwtRefresh, timeAhead, jwt } =
    useAuth();

  const [timeLeft, setTimeLeft] = useState(timeAhead);

  useEffect(() => {
    if (isExtendDialogOpen) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1000);
      }, 1000);

      if (timeLeft === 0) {
        if (jwt) {
          handleLogout(jwt);
          setTimeLeft(timeAhead);
        }
      }

      return () => clearInterval(timer);
    }
  }, [isExtendDialogOpen, timeLeft, handleLogout]);

  return (
    <Dialog
      open={isExtendDialogOpen}
      onClose={() => {
        if (jwt) handleLogout(jwt);
      }}
    >
      <DialogTitle>JWT Timeout</DialogTitle>
      <DialogContent>
        <p>
          Your Token will expire in {timeLeft / 1000} seconds. Do you want to
          extend?
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (jwt) {
              handleLogout(jwt);
              setTimeLeft(timeAhead);
            }
          }}
        >
          Logout
        </Button>
        <Button
          onClick={() => {
            if (jwt) handleJwtRefresh(jwt);
            setTimeLeft(timeAhead);
          }}
        >
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JwtTimeoutDialog;
