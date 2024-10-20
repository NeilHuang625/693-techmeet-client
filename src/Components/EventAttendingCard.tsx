import { Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
// import utc from "dayjs-plugin-utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { AppContext, AppEvent } from "../App";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

// dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

interface EventAttendingCardProps {
  event: AppEvent;
}

const EventAttendingCard: React.FC<EventAttendingCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = new Date();
  const { eventsWaiting } = useContext(AppContext);
  const isWaiting = eventsWaiting.some((e) => e.id === event.id);
  const isPastEvent = dayjs(event.startTime).isBefore(currentTime);

  return (
    <div
      className={`flex flex-col mb-8 ${isPastEvent ? "text-gray-500" : ""} `}
    >
      <Typography variant="h5">
        {dayjs(event.startTime).format("dddd D MMMM")}
      </Typography>
      <div className="my-1">
        <Divider />
      </div>

      <div
        className="flex py-1 rounded-lg hover:shadow-md cursor-pointer"
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
            className="ml-2 font-bold"
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
          <Typography variant="body1">
            {event.currentAttendees} attendees
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            {isPastEvent ? (
              <CheckCircleIcon color="disabled" />
            ) : isWaiting ? (
              <HourglassTopIcon color="warning" />
            ) : (
              <CheckCircleIcon color="success" />
            )}
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold" }}
              color="text.secondary"
            >
              {isPastEvent
                ? "Attended"
                : isWaiting
                ? "On the waitlist"
                : "Attending"}
            </Typography>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default EventAttendingCard;
