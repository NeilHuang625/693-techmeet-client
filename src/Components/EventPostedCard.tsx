import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAuth } from "../Contexts/AuthProvider";
import dayjs from "dayjs";
import { deleteEvent } from "../Utils/API";
import { toast } from "react-toastify";
import { AppContext } from "../App";
import { useContext } from "react";
import ConfirmDialog from "./Dialogs/ConfirmDialog";
import { AppEvent } from "../App";

interface EventPostedCardProps {
  event: AppEvent;
}

const EventPostedCard: React.FC<EventPostedCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = new Date();
  const isPastEvent = dayjs(event.startTime).isBefore(currentTime);
  const { jwt } = useAuth();
  const { allEvents, setAllEvents } = useContext(AppContext);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEventDelete = async () => {
    try {
      if (!jwt) {
        return;
      }
      await deleteEvent(jwt, event.id);
      setAllEvents(allEvents.filter((e) => e.id !== event.id));
      setOpenDeleteDialog(false);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    navigate(`/edit-event/${event.id}`);
  };

  return (
    <div className="flex flex-col w-full rounded-lg bg-white shadow-md hover:shadow-lg my-8">
      <div className="grid grid-cols-7">
        <div
          className="flex col-span-6  cursor-pointer"
          onClick={() => {
            navigate(`/event-details/${event.id}`);
          }}
        >
          <img
            src={event.imageUrl}
            alt=""
            className="object-contain max-w-full h-[100px] rounded-lg"
          />
          <div className="flex flex-col ml-4">
            <Typography
              color={`${isPastEvent ? "text-gray-500" : "green"}`}
              variant="h6"
              className="ml-2 font-bold "
            >
              {dayjs(event.startTime).tz(tz).format("ddd, MMM D · HH:mm zzz")}
            </Typography>
            <Typography
              variant="body1"
              className="ml-2"
              sx={{ fontWeight: "bold" }}
            >
              {event.title}
            </Typography>
            <Typography variant="body2">{event.location}</Typography>
          </div>
        </div>
        <div className="col-span-1  flex flex-col items-center justify-center">
          <Stack spacing={2}>
            <Button
              onClick={handleEditClick}
              size="small"
              color="inherit"
              variant="contained"
              sx={{
                backgroundColor: "inherit",
                "&:hover": {
                  backgroundColor: "#ced4da",
                  color: "white",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </Button>
            <Button
              onClick={() => setOpenDeleteDialog(true)}
              size="small"
              color="inherit"
              variant="contained"
              sx={{
                backgroundColor: "inherit",
                "&:hover": {
                  backgroundColor: "#ced4da",
                  color: "white",
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </Button>
          </Stack>
        </div>
      </div>
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this event?"
        actionName="Yes"
        action={handleEventDelete}
      />
    </div>
  );
};

export default EventPostedCard;
