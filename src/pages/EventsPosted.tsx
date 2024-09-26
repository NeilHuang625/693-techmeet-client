import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { AppContext } from "../App";
import { useContext } from "react";
import EventPostedCard from "../Components/EventPostedCard";

const EventsPosted = () => {
  const { eventsCreated } = useContext(AppContext);
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-grow flex-col items-center my-6">
        <div className="w-2/3">
          <h1 className="text-2xl font-bold">Events Posted</h1>
          {eventsCreated.length > 0 ? (
            <div>
              {eventsCreated.map((e) => (
                <EventPostedCard event={e} key={e.id} />
              ))}
            </div>
          ) : (
            <h2>No events created</h2>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPosted;
