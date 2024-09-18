import NavBar from "../Components/NavBar";
import EventSlide from "../Components/EventSlide";
import FilterBar from "../Components/FilterBar";
import EventContainer from "../Components/EventContainer";
import { getAllEvents } from "../Utils/API";
import { createContext, useContext, useEffect, useState } from "react";
import dayjs from "dayjs";

export interface AppEvent {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  city: string;
  imageUrl: string;
  userId: string;
  maxAttendees: number;
  promoted: boolean;
  categoryId: number;
  category: string;
}

export interface HomePageContextType {
  events: AppEvent[];
  setEvents: (events: AppEvent[]) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedRadio: string;
  setSelectedRadio: (radio: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  allEvents: AppEvent[];
}

const HomePageContext = createContext<HomePageContextType>({
  events: [],
  setEvents: () => {},
  selectedCity: "",
  setSelectedCity: () => {},
  selectedCategories: [],
  setSelectedCategories: () => {},
  selectedRadio: "",
  setSelectedRadio: () => {},
  selectedDate: "",
  setSelectedDate: () => {},
  allEvents: [],
});

export const useHomePageContext = () => {
  return useContext(HomePageContext);
};

const HomePage = () => {
  const [allEvents, setAllEvents] = useState<AppEvent[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [promotedEvents, setPromotedEvents] = useState<AppEvent[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [categoryCountsArray, setCategoryCountsArray] = useState<
    { category: string; count: number }[]
  >([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        const eventsWithLocalTime = response.data.map((event) => ({
          ...event,
          startTime: dayjs(event.startTime).format("YYYY-MM-DD HH:mm"),
          endTime: dayjs(event.endTime).format("YYYY-MM-DD HH:mm"),
        }));
        const promotedEvents = eventsWithLocalTime.filter(
          (event) => event.promoted
        );
        const cities = Array.from(
          new Set(eventsWithLocalTime.map((event) => event.city))
        );

        // Count the number of events in each category
        const categoryCounts = eventsWithLocalTime.reduce((acc, event) => {
          if (!acc[event.category]) {
            acc[event.category] = 1;
          } else {
            acc[event.category] += 1;
          }
          return acc;
        }, {});

        const categoryCountsArray = Object.entries(categoryCounts).map(
          ([key, value]) => ({ category: key, count: value })
        );
        setPromotedEvents(promotedEvents);
        setEvents(eventsWithLocalTime);
        setAllEvents(eventsWithLocalTime);
        setCities(cities);
        setCategoryCountsArray(categoryCountsArray);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterClick = () => {
    const filteredEvents = allEvents.filter((event) => {
      const cityMatch = selectedCity
        ? selectedCity === "All"
          ? true
          : event.city === selectedCity
        : true;
      const categoryMatch =
        selectedCategories.length > 0
          ? selectedCategories.includes(event.category)
          : true;
      let radioMatch = true;
      if (selectedRadio === "today") {
        radioMatch = dayjs(event.startTime).isSame(dayjs(), "day");
      } else if (selectedRadio === "within-this-week") {
        radioMatch = dayjs(event.startTime).isSame(dayjs(), "week");
      } else if (selectedRadio === "date") {
        radioMatch = dayjs(event.startTime).isSame(dayjs(selectedDate), "day");
      }
      return cityMatch && categoryMatch && radioMatch;
    });
    setEvents(filteredEvents);
  };
  console.log("events", events);

  return (
    <HomePageContext.Provider
      value={{
        events,
        setEvents,
        selectedCity,
        setSelectedCity,
        selectedCategories,
        setSelectedCategories,
        selectedRadio,
        setSelectedRadio,
        selectedDate,
        setSelectedDate,
        allEvents,
      }}
    >
      <div className="flex flex-col">
        <NavBar />
        <EventSlide promotedEvents={promotedEvents} />
        <FilterBar
          cities={cities}
          categoryCountsArray={categoryCountsArray}
          handleFilterClick={handleFilterClick}
        />
        <EventContainer events={events} />
      </div>
    </HomePageContext.Provider>
  );
};

export default HomePage;
