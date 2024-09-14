import EventCard from "./EventCard";

const EventContainer = ({ events }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mx-20 my-8">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventContainer;
