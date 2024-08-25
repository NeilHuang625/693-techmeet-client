import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface EditEventCardProps {
  event: {
    eventId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    maxParticipants: number;
    imagePath: string;
  };
  onDelete: (eventId: string) => void;
}

const EditEventCard = ({ event, onDelete }: EditEventCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader title={event.title} />
      <CardContent>
        <p style={{ margin: "0" }}>{event.description}</p>
        <div style={{ display: "flex", alignItems: "center", margin: "0" }}>
          <Typography variant="body1" style={{ marginRight: "4px" }}>
            Time:
          </Typography>
          <p>{dayjs(event.startTime).format("YYYY-MM-DD HH:mm")}</p> {" - "}
          <p>{dayjs(event.endTime).format("YYYY-MM-DD HH:mm")}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "0" }}>
          <Typography variant="body1" style={{ marginRight: "4px" }}>
            Location:
          </Typography>
          <p>{event.location}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "0" }}>
          <Typography variant="body1" style={{ marginRight: "4px" }}>
            Max:
          </Typography>
          <p>{event.maxParticipants}</p>
        </div>
        <img
          src={event.imagePath}
          height="140"
          alt={event.title}
          style={{ margin: "0" }}
        />
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() =>
            navigate("/update-event", { state: { eventId: event.eventId } })
          }
        >
          Edit
        </Button>
        <Button
          size="small"
          color="secondary"
          onClick={() => onDelete(event.eventId)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default EditEventCard;
