import * as yup from "yup";

// Signup form validation
const signupValidationSchema = yup.object({
  nickname: yup
    .string()
    .min(3, "Name should be more than 2 characters")
    .max(20, "Name can not be longer than 20 characters")
    .required("Nickname is required"),
  imageFile: yup
    .mixed()
    .test(
      "fileSize",
      "File size is larger than 2MB",
      (value) => value && (value as File).size <= 2 * 1024 * 1024
    )
    .required("Image is required"),
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

export default signupValidationSchema;
