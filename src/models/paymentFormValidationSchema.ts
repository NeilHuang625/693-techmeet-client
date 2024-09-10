import * as yup from "yup";

const paymentFormValidationSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .matches(
      /^06\d{13}$/,
      "Card number must start with '06' and be a 15-digit number"
    )
    .required("Card Number is required"),
  nameOnCard: yup.string().required("Name on Card is required"),
  expireMonth: yup.string().required("Expire Month is required"),
  expireYear: yup.string().required("Expire Year is required"),
  cvv: yup
    .string()
    .matches(/^\d{3}$/, "CVV must be a 3-digit number")
    .required("CVV is required"),
});

export default paymentFormValidationSchema;
