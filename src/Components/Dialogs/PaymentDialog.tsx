import React from "react";
import { useFormik } from "formik";
import paymentFormValidationSchema from "../../models/paymentFormValidationSchema";
import { upgradeToVIP } from "../../Utils/API";
import { months, years } from "../../Utils/YearAndMonthGenerator";
import { useAuth } from "../../Contexts/AuthProvider";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  jwt: string | null;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose }) => {
  const { jwt, setJwt } = useAuth();

  const paymentFormik = useFormik({
    initialValues: {
      cardNumber: "",
      nameOnCard: "",
      expireMonth: "",
      expireYear: "",
      cvv: "",
    },
    validationSchema: paymentFormValidationSchema,
    onSubmit: async () => {
      try {
        const response = await upgradeToVIP(jwt);
        if (response.status === 200) {
          onClose();
          const jwt = response.data.token.result;
          setJwt(jwt);
          paymentFormik.resetForm();
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          onClose();
          paymentFormik.resetForm();
        }}
      >
        <DialogTitle>Payment Credit Card</DialogTitle>
        <DialogContent>
          <form onSubmit={paymentFormik.handleSubmit}>
            <TextField
              label="Card Number"
              id="cardNumber"
              name="cardNumber"
              value={paymentFormik.values.cardNumber}
              onChange={paymentFormik.handleChange}
              error={
                paymentFormik.touched.cardNumber &&
                Boolean(paymentFormik.errors.cardNumber)
              }
              helperText={
                paymentFormik.touched.cardNumber &&
                paymentFormik.errors.cardNumber
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Name on Card"
              id="nameOnCard"
              name="nameOnCard"
              value={paymentFormik.values.nameOnCard}
              onChange={paymentFormik.handleChange}
              error={
                paymentFormik.touched.nameOnCard &&
                Boolean(paymentFormik.errors.nameOnCard)
              }
              helperText={
                paymentFormik.touched.nameOnCard &&
                paymentFormik.errors.nameOnCard
              }
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Stack direction="row" spacing={2} marginTop={2} marginBottom={1}>
              <TextField
                select
                label="Expiry Date"
                id="expireMonth"
                name="expireMonth"
                value={paymentFormik.values.expireMonth}
                onChange={paymentFormik.handleChange}
                error={
                  paymentFormik.touched.expireMonth &&
                  Boolean(paymentFormik.errors.expireMonth)
                }
                helperText={
                  paymentFormik.touched.expireMonth &&
                  paymentFormik.errors.expireMonth
                }
                variant="outlined"
                fullWidth
                margin="normal"
              >
                {months.map((month, i) => (
                  <MenuItem value={month} key={i}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Expiry Date"
                id="expireYear"
                name="expireYear"
                value={paymentFormik.values.expireYear}
                onChange={paymentFormik.handleChange}
                error={
                  paymentFormik.touched.expireYear &&
                  Boolean(paymentFormik.errors.expireYear)
                }
                helperText={
                  paymentFormik.touched.expireYear &&
                  paymentFormik.errors.expireYear
                }
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
            <Stack direction="row" spacing={2} marginTop={3} marginBottom={2}>
              <TextField
                disabled
                label="Amount"
                value="NZ$ 200"
                margin="normal"
                variant="filled"
              />
              <TextField
                label="CVV"
                id="cvv"
                name="cvv"
                value={paymentFormik.values.cvv}
                onChange={paymentFormik.handleChange}
                error={
                  paymentFormik.touched.cvv && Boolean(paymentFormik.errors.cvv)
                }
                helperText={
                  paymentFormik.touched.cvv && paymentFormik.errors.cvv
                }
                variant="outlined"
                margin="normal"
              />
            </Stack>

            <Button
              color="error"
              onClick={() => {
                onClose();
                paymentFormik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Pay</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentDialog;
