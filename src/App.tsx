import HomePage from "./pages/HomePage";
import { ThemeProvider } from "./Contexts/ThemeProvider";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import JwtTimeoutDialog from "./Components/Dialogs/JwtTimeoutDialog";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventsPosted from "./pages/EventsPosted";
import EventsAttending from "./pages/EventsAttending";
import EventDetails from "./pages/EventDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllEvents,
  getUserEvents,
  basicURL,
  getAllNotifications,
} from "./Utils/API";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "./Contexts/AuthProvider";
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";
import * as signalR from "@microsoft/signalr";

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

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  userId: string;
  eventId: number;
  createdAt: string;
  type: string;
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
  eventsAttending: AppEvent[];
  setEventsAttending: (events: AppEvent[]) => void;
  eventsWaiting: AppEvent[];
  setEventsWaiting: (events: AppEvent[]) => void;
  eventsCreated: AppEvent[];
  setEventsCreated: (events: AppEvent[]) => void;
  openLoginDialog: boolean;
  setOpenLoginDialog: (open: boolean) => void;
  setUpdateAllEvents: (update: boolean) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

export const AppContext = createContext({} as AppContextType);

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
  const [eventsAttending, setEventsAttending] = useState<AppEvent[]>([]); // Array of event IDs
  const [eventsWaiting, setEventsWaiting] = useState<AppEvent[]>([]); // Array of event IDs
  const [eventsCreated, setEventsCreated] = useState<AppEvent[]>([]);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [updateAllEvents, setUpdateAllEvents] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { isAuthenticated, user, isLoading, jwt } = useAuth();

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
        setEvents(eventsWithLocalTime);
        setAllEvents(eventsWithLocalTime);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvents();
  }, [isLoading, isAuthenticated, jwt, user, updateAllEvents]);

  useEffect(() => {
    const getPromotedEvents = allEvents.filter((event) => event.promoted);
    setPromotedEvents(getPromotedEvents);
    const getCities = Array.from(new Set(allEvents.map((event) => event.city)));
    setCities(getCities);
    const categoryCounts = allEvents.reduce((acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = 1;
      } else {
        acc[event.category] += 1;
      }
      return acc;
    }, {});
    const getCategoryCountsArray = Object.entries(categoryCounts).map(
      ([key, value]) => ({ category: key, count: value })
    );
    setCategoryCountsArray(getCategoryCountsArray);
    if (isAuthenticated) {
      const fetchUserEvents = async () => {
        try {
          const eventsBasedOnUser = await getUserEvents(jwt, user?.id);
          const eventsAttending = allEvents.filter((e) =>
            eventsBasedOnUser.data.attendingEvents.includes(e.id)
          );
          const eventsWaiting = allEvents.filter((e) =>
            eventsBasedOnUser.data.waitlistedEvents.includes(e.id)
          );
          setEventsAttending(eventsAttending);
          setEventsWaiting(eventsWaiting);

          // Get the events that created by the user
          const eventsCreated = allEvents.filter((e) => e.userId === user?.id);
          setEventsCreated(eventsCreated);
        } catch (err) {
          console.log(err);
        }
      };
      fetchUserEvents();
    }
  }, [allEvents, isLoading, isAuthenticated, jwt, user, updateAllEvents]);

  // Get the notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getAllNotifications(jwt);
        console.log("utc", response.data);
        const notificationsWithLocalTime = response.data.map(
          (n: Notification) => ({
            ...n,
            createdAt: dayjs.utc(n.createdAt).local().format(),
          })
        );
        console.log("local", notificationsWithLocalTime);
        setNotifications(notificationsWithLocalTime);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotifications();
  }, [isAuthenticated]);

  // SignalR
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${basicURL}/notificationHub`, {
        accessTokenFactory: () => jwt || "",
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification) => {
      setNotifications((preNotifications) => [
        ...preNotifications,
        notification,
      ]);
    });

    connection.start().catch((err) => console.log(err));

    return () => {
      connection.stop().catch((err) => console.log(err));
    };
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

  return (
    <ThemeProvider>
      <ToastContainer position="bottom-center" autoClose={2000} />
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
            eventsAttending,
            setEventsAttending,
            eventsWaiting,
            setEventsWaiting,
            eventsCreated,
            setEventsCreated,
            openLoginDialog,
            setOpenLoginDialog,
            setUpdateAllEvents,
            notifications,
            setNotifications,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<HomePage handleFilterClick={handleFilterClick} />}
            />
            <Route path="/event-details/:eventId" element={<EventDetails />} />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-event/:eventId"
              element={
                <ProtectedRoute>
                  <EditEvent />
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
            <Route
              path="/events-attending"
              element={
                <ProtectedRoute>
                  <EventsAttending />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
