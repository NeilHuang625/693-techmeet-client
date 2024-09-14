import EventCard from "./EventCard";

const EventContainer = ({ events }) => {
  return (
    <div className="grid grid-cols-4 w-4/5 gap-6 mx-auto my-8">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventContainer;
