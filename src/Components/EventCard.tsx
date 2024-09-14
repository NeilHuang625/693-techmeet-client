import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { AppEvent } from "../App";
import dayjs from "dayjs";

interface EventCardProps {
  event: AppEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <CardActionArea>
      <Card>
        <CardMedia
          className="h-36"
          component="img"
          image={event.imageUrl}
          alt={event.title}
        />
        <CardContent>
          <Typography gutterBottom variant="body1" component="div">
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
          <Typography variant="body2">
            {dayjs(event.startTime).format("ddd, D MMM h:mma")}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default EventCard;
