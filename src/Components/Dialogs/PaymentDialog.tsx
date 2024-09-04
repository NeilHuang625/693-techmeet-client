import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose }) => {
  const years = Array.from({ length: 20 }, (_, i) =>
    (new Date().getFullYear() + i).toString().slice(-2)
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Payment Credit Card</DialogTitle>
        <DialogContent>
          <TextField
            label="Card Number"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name on Card"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Stack direction="row">
            <TextField
              select
              label="Expiry Date"
              variant="outlined"
              fullWidth
              margin="normal"
            >
              <MenuItem>1</MenuItem>
            </TextField>
            <TextField
              select
              label="Expiry Date"
              variant="outlined"
              fullWidth
              margin="normal"
            >
              {years.map((year, i) => (
                <MenuItem value={year} key={i}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField label="CVV" variant="outlined" fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button>Pay</Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentDialog;
