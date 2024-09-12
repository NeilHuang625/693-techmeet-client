import NavBar from "../Components/NavBar";
import EventSlide from "../Components/EventSlide";
import { getAllEvents } from "../Utils/API";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export interface AppEvent {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl: string;
  userId: string;
  maxAttendees: number;
  promoted: boolean;
  categoryId: number;
}

const HomePage = () => {
  const [events, setEvents] = useState<AppEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        const eventsWithLocalTime = response.data.map((event) => ({
          ...event,
          startTime: dayjs(event.startTime).format("YYYY-MM-DD HH:mm"),
          endTime: dayjs(event.endTime).format("YYYY-MM-DD HH:mm"),
        }));
        setEvents(eventsWithLocalTime);
        console.log(eventsWithLocalTime);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvents();
  }, []);

  const promotedEvents = events.filter((event) => event.promoted);

  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="mt-2">
        <EventSlide promotedEvents={promotedEvents} />
      </div>
    </div>
  );
};

export default HomePage;
