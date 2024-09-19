import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { AppEvent } from "../App";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: AppEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const handleEventCardClick = () => {
    navigate("/event-details", { state: { event } });
  };

  return (
    <CardActionArea onClick={handleEventCardClick}>
      <Card>
        <CardMedia
          className="h-36"
          component="img"
          image={event.imageUrl}
          alt={event.title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="body1"
            component="div"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
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
