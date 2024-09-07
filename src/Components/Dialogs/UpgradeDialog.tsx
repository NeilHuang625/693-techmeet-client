import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface UpgradeDialogProps {
  jwt: string | null;
  open: boolean;
  onClose: () => void;
  handleUpgrade: () => void;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  open,
  onClose,
  handleUpgrade,
}) => {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>1 year VIP for just NZ$200</DialogTitle>
        <DialogContent>
          <p>Upgrade to VIP to unlock the EVENT creation feature</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpgrade}>Upgrade</Button>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpgradeDialog;
