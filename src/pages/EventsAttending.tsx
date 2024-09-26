import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import EventAttendingCard from "../Components/EventAttendingCard";
import { AppContext } from "../App";
import { useContext } from "react";

const EventsAttending = () => {
  const { eventsAttending, eventsWaiting } = useContext(AppContext);
  const allEvents = [...eventsAttending, ...eventsWaiting];
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-grow flex-col items-center my-6">
        <div className="w-1/2">
          <h1 className="text-2xl font-bold">Your Events</h1>
          {allEvents.length > 0 ? (
            <div className="my-8">
              {allEvents.map((event) => (
                <EventAttendingCard event={event} key={event.id} />
              ))}
            </div>
          ) : (
            <h2 className="mt-6 text-lg">No events attending</h2>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventsAttending;
