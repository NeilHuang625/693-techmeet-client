import * as yup from "yup";

// Event form validation
const createEventValidationSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, "Title have to be at least 3 letters")
    .max(50, "Title can not be more than 50 letters")
    .required("Title is required"),
  startTime: yup.string().required("Start Time is required"),
  endTime: yup.string().required("End Time is required"),
  description: yup.string().required("Description is required"),
  maxAttendees: yup
    .number()
    .positive("Max attendee must be a positive number")
    .required("Max attendee is required"),
  location: yup.string().required("Location is required"),
  category: yup.string().required("Category is required"),
  imageFile: yup
    .mixed()
    .test(
      "fileSize",
      "File size is larger than 2MB",
      (value) => value && (value as File).size <= 2 * 1024 * 1024
    )
    .required("Image is required"),
  isPromoted: yup.boolean().required("Promotion is required"),
});

export default createEventValidationSchema;
