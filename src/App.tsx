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
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllEvents,
  getUserEvents,
  basicURL,
  getAllNotifications,
  getAllMessages,
} from "./Utils/API";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "./Contexts/AuthProvider";
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";
import * as signalR from "@microsoft/signalr";
import { MessageProps } from "./pages/Chat";
import React from "react";

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
  profileImageUrl: string;
  user: string;
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
  setAllEvents: React.Dispatch<React.SetStateAction<AppEvent[]>>;
  promotedEvents: AppEvent[];
  cities: string[];
  categoryCountsArray: { category: string; count: number }[];
  eventsAttending: AppEvent[];
  setEventsAttending: (events: AppEvent[]) => void;
  eventsWaiting: AppEvent[];
  setEventsWaiting: React.Dispatch<React.SetStateAction<AppEvent[]>>;
  eventsCreated: AppEvent[];
  setEventsCreated: (events: AppEvent[]) => void;
  openLoginDialog: boolean;
  setOpenLoginDialog: (open: boolean) => void;
  setUpdateAllEvents: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  message: string;
  setMessage: (message: string) => void;
  messages: MessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  hubConnection: signalR.HubConnection | undefined;
  messagesAfterGroup: {
    [key: string]: { messages: MessageProps[]; unreadCount: number };
  };
  setMessagesAfterGroup: (messages: {
    [key: string]: { messages: MessageProps[]; unreadCount: number };
  }) => void;
  totalUnreadCount: number;
  setTotalUnreadCount: (count: number) => void;
  event: AppEvent | undefined;
  setEvent: React.Dispatch<React.SetStateAction<AppEvent | undefined>>;
}

export const AppContext = createContext({} as AppContextType);

function App() {
  const [allEvents, setAllEvents] = React.useState<AppEvent[]>([]);
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
  const [updateAllEvents, setUpdateAllEvents] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection>(); // SignalR connection for sending messages
  const [messagesAfterGroup, setMessagesAfterGroup] = useState({});
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [event, setEvent] = React.useState<AppEvent>();

  const { isAuthenticated, user, isLoading, jwt } = useAuth();

  dayjs.extend(utc);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        const eventsWithLocalTime = response.data.map((event: AppEvent) => ({
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
    const categoryCounts = allEvents.reduce(
      (acc: { [key: string]: number }, event) => {
        if (!acc[event.category]) {
          acc[event.category] = 1;
        } else {
          acc[event.category] += 1;
        }
        return acc;
      },
      {}
    );
    const getCategoryCountsArray = Object.entries(categoryCounts).map(
      ([key, value]) => ({ category: key, count: value })
    );
    setCategoryCountsArray(getCategoryCountsArray);
    if (isAuthenticated) {
      const fetchUserEvents = async () => {
        try {
          if (jwt && user && user.id) {
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
            const eventsCreated = allEvents.filter(
              (e) => e.userId === user?.id
            );
            setEventsCreated(eventsCreated);
          } else {
            console.log("jwt or user is null");
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchUserEvents();
    }
  }, [allEvents, isLoading, isAuthenticated, jwt, user, updateAllEvents]);

  // Get the notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchNotifications = async () => {
      try {
        if (jwt) {
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
        } else {
          console.log("JWT is not defined");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotifications();
  }, [isAuthenticated, allEvents]);

  // SignalR for notifications
  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated, jwt]);

  // SignalR for chat
  useEffect(() => {
    if (!isAuthenticated) return;

    const hubConnect = new signalR.HubConnectionBuilder()
      .withUrl(`${basicURL}/chatHub`, {
        accessTokenFactory: () => jwt || "",
      })
      .withAutomaticReconnect()
      .build();

    hubConnect.start().catch((err) => console.log(err));

    hubConnect.on("ReceiveMessage", (receivedMessage) => {
      console.log(receivedMessage);
      setMessages((pre) => [...pre, receivedMessage]);
    });
    setHubConnection(hubConnect);
    return () => {
      hubConnect.stop().catch((err) => console.log(err));
    };
  }, [isAuthenticated, jwt]);

  // Fetch all messages
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const response = await getAllMessages(jwt || "");
        setMessages(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllMessages();
  }, [jwt]);

  // Group messages by receiver
  useEffect(() => {
    const messagesAfterGroup = messages.reduce(
      (
        acc: {
          [key: string]: { messages: MessageProps[]; unreadCount: number };
        },
        message: MessageProps
      ) => {
        let otherUserId = null;
        if (message.receiverId === user?.id) {
          otherUserId = message.senderId;
        } else if (message.senderId === user?.id) {
          otherUserId = message.receiverId;
        }
        if (otherUserId) {
          if (!acc[otherUserId]) {
            acc[otherUserId] = { messages: [], unreadCount: 0 };
          }
          acc[otherUserId].messages.push(message);
          if (!message.isRead && message.receiverId === user?.id) {
            acc[otherUserId].unreadCount += 1;
          }
        }
        return acc;
      },
      {}
    );
    const totalUnreadCount = Object.values(messagesAfterGroup).reduce(
      (acc, { unreadCount }) => acc + unreadCount,
      0
    );
    setTotalUnreadCount(totalUnreadCount);
    setMessagesAfterGroup(messagesAfterGroup);
  }, [messages]);

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
            message,
            setMessage,
            messages,
            setMessages,
            hubConnection,
            messagesAfterGroup,
            setMessagesAfterGroup,
            totalUnreadCount,
            setTotalUnreadCount,
            event,
            setEvent,
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
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
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
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:receiverId"
              element={
                <ProtectedRoute>
                  <Chat />
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
