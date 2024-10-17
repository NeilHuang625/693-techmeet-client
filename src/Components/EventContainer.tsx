import EventCard from "./EventCard";
import { AppEvent } from "../App";
import React from "react";

interface EventContainerProps {
  events: AppEvent[];
}

const EventContainer: React.FC<EventContainerProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-4 w-4/5 gap-6 mx-auto my-8">
      {events.map((event, index) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
};

export default EventContainer;
