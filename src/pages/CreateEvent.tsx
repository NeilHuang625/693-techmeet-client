import NavBar from "../Components/NavBar";
import PromotePaymentDialog from "../Components/Dialogs/PromotePaymentDialog";
import { useAuth } from "../Contexts/AuthProvider";
import { AppContext } from "../App";
import { useContext } from "react";
import { getAllCategories, createEvent } from "../Utils/API";
import { usePlacesWidget } from "react-google-autocomplete";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./react-quill-form.css";
import {
  InputLabel,
  Button,
  TextField,
  Select,
  Input,
  Box,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Checkbox,
  MenuItem,
} from "@mui/material";
import createEventValidationSchema from "../models/createEventValidationSchema";
import { useFormik, FormikProvider, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateEvent = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [promotePaymentDialogOpen, setPromotePaymentDialogOpen] =
    useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<any>({});
  const { user, jwt } = useAuth();
  const { setUpdateAllEvents } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  const handleCreateEvent = async (newEvent: any) => {
    const userId = user?.id;
    const formData = new FormData();
    formData.append("UserId", userId as string);
    formData.append("Title", newEvent.title);
    formData.append("StartTime", newEvent.startTime);
    formData.append("EndTime", newEvent.endTime);
    formData.append("Description", newEvent.description);
    formData.append("MaxAttendees", newEvent.maxAttendees.toString());
    formData.append("Location", newEvent.location);
    formData.append("City", newEvent.city);
    formData.append("CategoryId", newEvent.category.toString());
    formData.append("Promoted", newEvent.promoted.toString());
    formData.append("ImageFile", newEvent.imageFile as File);

    try {
      if (!jwt) {
        throw new Error("JWT invalid");
      }
      await createEvent(formData, jwt);
      setUpdateAllEvents((pre) => !pre);
      navigate("/events-posted");
      toast.success("Event created successfully");
    } catch (err) {
      console.log(err);
    }
  };

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
      promoted: false,
      city: "",
    },
    validationSchema: createEventValidationSchema,
    onSubmit: async (newEvent) => {
      if (!jwt) {
        alert("You need to login to create an event");
        return;
      }
      setNewEvent(newEvent);

      if (createEventForm.values.promoted) {
        setPromotePaymentDialogOpen(true);
      } else {
        await handleCreateEvent(newEvent);
      }
    },
  });

  const { ref } = usePlacesWidget({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      const city = place.address_components.find((component) =>
        component.types.includes("locality")
      ).long_name;
      const address = place.formatted_address;
      createEventForm.setFieldValue("location", address);
      createEventForm.setFieldValue("city", city);
    },
    options: {
      types: ["address"],
      componentRestrictions: { country: "nz" },
    },
  });

  return (
    <>
      <PromotePaymentDialog
        open={promotePaymentDialogOpen}
        onClose={() => setPromotePaymentDialogOpen(false)}
        handleCreateEvent={() => handleCreateEvent(newEvent)}
      />
      <FormikProvider value={createEventForm}>
        <NavBar />
        <div className=" flex justify-center items-center mt-4 pb-8">
          <div className="w-3/5 ">
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
                {(msg) => (
                  <p className=" flex justify-end text-xs text-red-600">
                    {msg}
                  </p>
                )}
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
                  inputRef={ref}
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
                <FormControl
                  className="w-1/4 min-h-[4rem]"
                  variant="outlined"
                  size="small"
                  margin="dense"
                  error={
                    createEventForm.touched.category &&
                    Boolean(createEventForm.errors.category)
                  }
                >
                  <InputLabel htmlFor="category">Category</InputLabel>
                  <Select
                    id="category"
                    name="category"
                    value={createEventForm.values.category}
                    onChange={createEventForm.handleChange}
                    label="category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {createEventForm.touched.category &&
                    createEventForm.errors.category && (
                      <FormHelperText>
                        {createEventForm.errors.category}
                      </FormHelperText>
                    )}
                </FormControl>
              </div>
              <div className="flex items-baseline space-x-6">
                <InputLabel className="w-[108px]" htmlFor="description">
                  Description
                </InputLabel>
                <div className="flex flex-col w-3/4">
                  <ReactQuill
                    theme="snow"
                    className="react-quill-form h-[1rem] "
                    id="description"
                    value={createEventForm.values.description}
                    onChange={(value) => {
                      createEventForm.setFieldValue("description", value);
                      createEventForm.validateField("description");
                    }}
                  />
                  {createEventForm.touched.description &&
                  createEventForm.errors.description ? (
                    <div className="text-red-500 text-sm">
                      {createEventForm.errors.description}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="pl-32">
                <FormControlLabel
                  control={
                    <Checkbox
                      id="promoted"
                      name="promoted"
                      checked={createEventForm.values.promoted}
                      onChange={createEventForm.handleChange}
                    />
                  }
                  label={
                    <>
                      Promote this event (
                      <span
                        className={
                          createEventForm.values.promoted ? "text-red-500" : ""
                        }
                      >
                        $NZD 5 charges apply
                      </span>
                      )
                    </>
                  }
                />
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="outlined" type="submit">
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      </FormikProvider>
    </>
  );
};

export default CreateEvent;
