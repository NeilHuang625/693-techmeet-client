import { Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const EventAttendingCard = ({ event }) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div className="flex flex-col mb-10">
      <Typography variant="h5">
        {dayjs(event.startTime).format("dddd D MMMM")}
      </Typography>
      <div className="my-2">
        <Divider />
      </div>

      <div className="flex">
        <img
          src={event.imageUrl}
          alt=""
          className="object-contain max-w-full h-[100px] rounded-lg"
        />
        <div className="flex flex-col ml-4">
          <Typography color="green" variant="h6" className="ml-2 font-bold">
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
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon color="success" />
            <Typography variant="body2" className="ml-2">
              Attending
            </Typography>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default EventAttendingCard;
