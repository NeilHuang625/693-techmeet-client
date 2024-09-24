import NavBar from "../Components/NavBar";
import { AppContext } from "../App";
import { useContext } from "react";

const EventsAttending = () => {
  const { eventsAttending } = useContext(AppContext);
  return (
    <>
      <NavBar />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold my-5">Events Attending</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventsAttending.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.imageUrl} alt={event.title} />
              <div className="event-card-content">
                <h3>{event.title}</h3>
                <p>{event.startTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EventsAttending;
