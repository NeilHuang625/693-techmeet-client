import HomePage from "./pages/HomePage";
import { ThemeProvider } from "./Contexts/ThemeProvider";
import { AuthProvider } from "./Contexts/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import JwtTimeoutDialog from "./Components/Dialogs/JwtTimeoutDialog";
import CreateEvent from "./pages/CreateEvent";
import EventsPosted from "./pages/EventsPosted";
import EventDetails from "./pages/EventDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllEvents } from "./Utils/API";
import { createContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";

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
  currentAttendees: number;
  maxAttendees: number;
  promoted: boolean;
  categoryId: number;
  category: string;
}

export interface AppContextType {
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
  setAllEvents: (events: AppEvent[]) => void;
  promotedEvents: AppEvent[];
  cities: string[];
  categoryCountsArray: { category: string; count: number }[];
}

export const AppContext = createContext({} as AppContextType);

// export const AppContextProvider = ({ children }) => {
//   const [events, setEvents] = useState<AppEvent[]>([]);
//   const [selectedCity, setSelectedCity] = useState<string>("");
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedRadio, setSelectedRadio] = useState<string>("");
//   const [selectedDate, setSelectedDate] = useState<string>(
//     new Date().toISOString().slice(0, 10)
//   );
//   const [allEvents, setAllEvents] = useState<AppEvent[]>([]);
//   const [promotedEvents, setPromotedEvents] = useState<AppEvent[]>([]);
//   const [cities, setCities] = useState<string[]>([]);
//   const [categoryCountsArray, setCategoryCountsArray] = useState<
//     { category: string; count: number }[]
//   >([]);

//   return (
//     <AppContext.Provider
//       value={{
//         events,
//         setEvents,
//         selectedCity,
//         setSelectedCity,
//         selectedCategories,
//         setSelectedCategories,
//         selectedRadio,
//         setSelectedRadio,
//         selectedDate,
//         setSelectedDate,
//         allEvents,
//         setAllEvents,
//         promotedEvents,
//         cities,
//         categoryCountsArray,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

function App() {
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

  dayjs.extend(utc);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        const eventsWithLocalTime = response.data.map((event) => ({
          ...event,
          startTime: dayjs
            .utc(event.startTime)
            .local()
            .format("YYYY-MM-DD HH:mm"),
          endTime: dayjs.utc(event.endTime).local().format("YYYY-MM-DD HH:mm"),
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
      if (selectedRadio === "all") {
        radioMatch = true;
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
    <ThemeProvider>
      <AuthProvider>
        <ToastContainer position="bottom-center" />
        <JwtTimeoutDialog />
        <BrowserRouter>
          <AppContext.Provider
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
              setAllEvents,
              promotedEvents,
              cities,
              categoryCountsArray,
            }}
          >
            <Routes>
              <Route
                path="/"
                element={<HomePage handleFilterClick={handleFilterClick} />}
              />
              <Route
                path="/event-details/:eventId"
                element={<EventDetails />}
              />
              <Route
                path="/create-event"
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events-posted"
                element={
                  <ProtectedRoute>
                    <EventsPosted />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppContext.Provider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
