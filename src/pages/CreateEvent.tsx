import NavBar from "../Components/NavBar";
import {
  InputLabel,
  Stack,
  TextField,
  Input,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import createEventValidationSchema from "../models/createEventValidationSchema";
import { useFormik, FormikProvider, ErrorMessage } from "formik";
import { useState } from "react";

const CreateEvent = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const createEventForm = useFormik({
    initialValues: {
      title: "",
      startTime: "",
      endTime: "",
      description: "",
      maxAttendees: 0,
      location: "",
      category: "",
      imageFile: null,
      isPromoted: false,
    },
    validationSchema: createEventValidationSchema,
    onSubmit: (values) => {
      console.log("values", values);
    },
  });

  return (
    <>
      <FormikProvider value={createEventForm}>
        <NavBar />
        <div className=" flex justify-center items-center mt-4">
          <div className="w-3/5 border ">
            <p className="text-xl text-white h-10 bg-gray-400 flex justify-center items-center">
              Create New Event
            </p>
            <form
              onSubmit={createEventForm.handleSubmit}
              className="w-5/6 mx-auto mt-3"
            >
              <div className="flex items-center space-x-5 ">
                <InputLabel
                  className="w-[108px] flex items-center"
                  htmlFor="imageFile"
                >
                  Event Photo
                </InputLabel>
                <Input
                  className="flex-2"
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  onChange={(e) => {
                    const target = e.currentTarget as HTMLInputElement;
                    const file: File = (target.files as FileList)[0];
                    createEventForm.setFieldValue("imageFile", file);
                    const url = URL.createObjectURL(file);
                    setImagePreviewUrl(url);
                  }}
                  error={
                    createEventForm.touched.imageFile &&
                    Boolean(createEventForm.errors.imageFile)
                  }
                ></Input>
                <div className="flex-4">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Event Photo"
                      style={{ width: "100%", height: "150px" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "200px",
                        height: "150px",
                        border: "1px dashed gray",
                        backgroundColor: "#e2e8f0",
                      }}
                    />
                  )}
                </div>
              </div>
              <ErrorMessage name="imageFile">
                {(msg) => <p className="text-xs text-red-600">{msg}</p>}
              </ErrorMessage>
              <div className="flex items-center space-x-6">
                <InputLabel className="w-[108px]" htmlFor="title">
                  Event Title
                </InputLabel>
                <TextField
                  className="w-3/4 min-h-[4rem]"
                  size="small"
                  id="title"
                  name="title"
                  label="Event Title"
                  value={createEventForm.values.title}
                  onChange={createEventForm.handleChange}
                  error={
                    createEventForm.touched.title &&
                    Boolean(createEventForm.errors.title)
                  }
                  helperText={
                    createEventForm.touched.title &&
                    createEventForm.errors.title
                  }
                  variant="outlined"
                  margin="dense"
                />
              </div>
              <div className="flex items-center space-x-6">
                <InputLabel htmlFor="location" className="w-[108px]">
                  Location
                </InputLabel>
                <TextField
                  className="w-3/4 min-h-[4rem]"
                  size="small"
                  id="location"
                  name="location"
                  label="Location"
                  value={createEventForm.values.location}
                  onChange={createEventForm.handleChange}
                  error={
                    createEventForm.touched.location &&
                    Boolean(createEventForm.errors.location)
                  }
                  helperText={
                    createEventForm.touched.location &&
                    createEventForm.errors.location
                  }
                  variant="outlined"
                  margin="dense"
                />
              </div>
              <div className="flex items-center space-x-6">
                <InputLabel className="w-[108px]" htmlFor="time">
                  Event Time
                </InputLabel>
                <TextField
                  className="w-1/3 min-h-[4rem]"
                  size="small"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  id="startTime"
                  name="startTime"
                  label="Start Time"
                  value={createEventForm.values.startTime}
                  onChange={createEventForm.handleChange}
                  error={
                    createEventForm.touched.startTime &&
                    Boolean(createEventForm.errors.startTime)
                  }
                  helperText={
                    createEventForm.touched.startTime &&
                    createEventForm.errors.startTime
                  }
                  variant="outlined"
                  margin="dense"
                />
                <TextField
                  className="w-1/3 min-h-[4rem]"
                  size="small"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  id="endTime"
                  name="endTime"
                  label="End Time"
                  value={createEventForm.values.endTime}
                  onChange={createEventForm.handleChange}
                  error={
                    createEventForm.touched.endTime &&
                    Boolean(createEventForm.errors.endTime)
                  }
                  helperText={
                    createEventForm.touched.endTime &&
                    createEventForm.errors.endTime
                  }
                  variant="outlined"
                  margin="dense"
                />
              </div>
              <div className="flex items-center space-x-6">
                <InputLabel className="w-[108px]" htmlFor="maxAttendees">
                  Max Attendees
                </InputLabel>
                <TextField
                  className="w-1/4 min-h-[4rem]"
                  size="small"
                  id="maxAttendees"
                  name="maxAttendees"
                  label="Max Attendees"
                  value={createEventForm.values.maxAttendees}
                  onChange={createEventForm.handleChange}
                  error={
                    createEventForm.touched.maxAttendees &&
                    Boolean(createEventForm.errors.maxAttendees)
                  }
                  helperText={
                    createEventForm.touched.maxAttendees &&
                    createEventForm.errors.maxAttendees
                  }
                  variant="outlined"
                  margin="dense"
                />
              </div>

              <div className="flex items-center space-x-6">
                <InputLabel className="w-[108px]" htmlFor="category">
                  Category
                </InputLabel>
                <TextField
                  className="w-1/4 min-h-[4rem]"
                  size="small"
                  id="category"
                  name="category"
                  label="Category"
                  value={createEventForm.values.category}
                  onChange={createEventForm.handleChange}
                  error={
                    createEventForm.touched.category &&
                    Boolean(createEventForm.errors.category)
                  }
                  helperText={
                    createEventForm.touched.category &&
                    createEventForm.errors.category
                  }
                  variant="outlined"
                  margin="dense"
                />
              </div>
              <div className="flex items-baseline space-x-6">
                <InputLabel className="w-[108px]" htmlFor="description">
                  Description
                </InputLabel>
                <TextField
                  className="w-3/4 min-h-[10rem]"
                  id="description"
                  size="small"
                  name="description"
                  label="Description"
                  value={createEventForm.values.description}
                  onChange={createEventForm.handleChange}
                  error={
                    createEventForm.touched.description &&
                    Boolean(createEventForm.errors.description)
                  }
                  helperText={
                    createEventForm.touched.description &&
                    createEventForm.errors.description
                  }
                  variant="outlined"
                  multiline
                  rows={4}
                  margin="dense"
                />
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    id="isPromoted"
                    name="isPromoted"
                    checked={createEventForm.values.isPromoted}
                    onChange={createEventForm.handleChange}
                  />
                }
                label="Pay and Promote this event"
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </FormikProvider>
    </>
  );
};

export default CreateEvent;
