import NavBar from "../Components/NavBar";
import PromotePaymentDialog from "../Components/Dialogs/PromotePaymentDialog";
import { useAuth } from "../Contexts/AuthProvider";
import { AppContext } from "../App";
import { useContext } from "react";
import { getAllCategories, updateEvent } from "../Utils/API";
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
import EditEventValidationSchema from "../models/EditEventValidationSchema";
import { useFormik, FormikProvider, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../Components/Footer";

const EditEvent = () => {
  const { eventId } = useParams();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [promotePaymentDialogOpen, setPromotePaymentDialogOpen] =
    useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<any>({});
  const [event, setEvent] = useState<any>();
  const { jwt } = useAuth();
  const { setUpdateAllEvents, allEvents } = useContext(AppContext);
  const navigate = useNavigate();

  const handleUpdateEvent = async (newEvent: any) => {
    const formData = new FormData();

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
      if (!jwt) return;
      await updateEvent(jwt, event.id, formData);
      setUpdateAllEvents((pre) => !pre);
      navigate("/events-posted");
      toast.success("Event updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const editEventForm = useFormik({
    initialValues: {
      title: "",
      startTime: "",
      endTime: "",
      description: "",
      maxAttendees: 0,
      location: "",
      category: "",
      imageFile: undefined,
      imageUrl: "",
      promoted: false,
      city: "",
    },
    validationSchema: EditEventValidationSchema,
    onSubmit: (updatedEvent) => {
      setNewEvent(updatedEvent);
      if (editEventForm.values.promoted && event.promoted === false) {
        setPromotePaymentDialogOpen(true);
      } else {
        handleUpdateEvent(updatedEvent);
      }
    },
  });

  useEffect(() => {
    const event = allEvents.find((event) => event.id === Number(eventId));
    if (event) {
      setImagePreviewUrl(event.imageUrl);
      setEvent(event);
      editEventForm.setValues({
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description,
        maxAttendees: event.maxAttendees,
        location: event.location,
        category: event.categoryId.toString(),
        imageFile: undefined,
        imageUrl: event.imageUrl,
        promoted: event.promoted,
        city: event.city,
      });
    }
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, [allEvents, eventId]);

  const { ref } = usePlacesWidget({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      const city = place.address_components.find(
        (component: { types: string[] }) => component.types.includes("locality")
      ).long_name;
      const address = place.formatted_address;
      editEventForm.setFieldValue("location", address);
      editEventForm.setFieldValue("city", city);
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
        handleCreateEvent={() => handleUpdateEvent(newEvent)}
      />
      <FormikProvider value={editEventForm}>
        <NavBar />
        <div className=" flex justify-center items-center mt-4 pb-8">
          <div className="w-3/5 ">
            <p className="text-xl text-white h-10 bg-gray-400 flex justify-center items-center">
              Update Event
            </p>
            <form
              onSubmit={editEventForm.handleSubmit}
              className="w-5/6 mx-auto mt-3"
            >
              <div className="flex items-center space-x-5 ">
                <input
                  type="text"
                  hidden
                  name="imageUrl"
                  value={editEventForm.values.imageUrl}
                  onChange={editEventForm.handleChange}
                />
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
                    if (file) {
                      editEventForm.setFieldValue("imageFile", file);
                      const url = URL.createObjectURL(file);
                      setImagePreviewUrl(url);
                    } else {
                      editEventForm.setFieldValue("imageFile", undefined);
                      setImagePreviewUrl(event?.imageUrl);
                    }
                  }}
                  error={
                    editEventForm.touched.imageFile &&
                    Boolean(editEventForm.errors.imageFile)
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
                  value={editEventForm.values.title}
                  onChange={editEventForm.handleChange}
                  error={
                    editEventForm.touched.title &&
                    Boolean(editEventForm.errors.title)
                  }
                  helperText={
                    editEventForm.touched.title && editEventForm.errors.title
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
                  value={editEventForm.values.location}
                  onChange={editEventForm.handleChange}
                  error={
                    editEventForm.touched.location &&
                    Boolean(editEventForm.errors.location)
                  }
                  helperText={
                    editEventForm.touched.location &&
                    editEventForm.errors.location
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
                  value={editEventForm.values.startTime}
                  onChange={editEventForm.handleChange}
                  error={
                    editEventForm.touched.startTime &&
                    Boolean(editEventForm.errors.startTime)
                  }
                  helperText={
                    editEventForm.touched.startTime &&
                    editEventForm.errors.startTime
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
                  value={editEventForm.values.endTime}
                  onChange={editEventForm.handleChange}
                  error={
                    editEventForm.touched.endTime &&
                    Boolean(editEventForm.errors.endTime)
                  }
                  helperText={
                    editEventForm.touched.endTime &&
                    editEventForm.errors.endTime
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
                  value={editEventForm.values.maxAttendees}
                  onChange={editEventForm.handleChange}
                  error={
                    editEventForm.touched.maxAttendees &&
                    Boolean(editEventForm.errors.maxAttendees)
                  }
                  helperText={
                    editEventForm.touched.maxAttendees &&
                    editEventForm.errors.maxAttendees
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
                    editEventForm.touched.category &&
                    Boolean(editEventForm.errors.category)
                  }
                >
                  <InputLabel htmlFor="category">Category</InputLabel>
                  <Select
                    id="category"
                    name="category"
                    value={editEventForm.values.category}
                    onChange={editEventForm.handleChange}
                    label="category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {editEventForm.touched.category &&
                    editEventForm.errors.category && (
                      <FormHelperText>
                        {editEventForm.errors.category}
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
                    value={editEventForm.values.description}
                    onChange={(value) => {
                      editEventForm.setFieldValue("description", value);
                      editEventForm.validateField("description");
                    }}
                  />
                  <div className="text-red-500 text-sm mt-12 ml-2">
                    {editEventForm.touched.description &&
                      editEventForm.errors.description && (
                        <p>{editEventForm.errors.description}</p>
                      )}
                  </div>
                </div>
              </div>
              <div className="pl-32 mt-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      id="promoted"
                      name="promoted"
                      disabled={event?.promoted}
                      checked={editEventForm.values.promoted}
                      onChange={editEventForm.handleChange}
                    />
                  }
                  label={
                    event?.promoted ? (
                      "Promoted"
                    ) : (
                      <>
                        Promote this event (
                        <span
                          className={
                            editEventForm.values.promoted ? "text-red-500" : ""
                          }
                        >
                          $NZD 5 charges apply
                        </span>
                        )
                      </>
                    )
                  }
                />
              </div>
              <div className="flex justify-center mt-3">
                <Button color="error" variant="contained" type="submit">
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </FormikProvider>
    </>
  );
};

export default EditEvent;
