import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { AppEvent } from "../App";

interface EventCardProps {
  event: AppEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={event.imagePath}
        alt={event.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Attend</Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
