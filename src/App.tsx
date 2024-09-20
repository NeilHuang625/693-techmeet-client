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

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl: string;
  userId: string;
  maxParticipants: string;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastContainer position="bottom-center" />
        <JwtTimeoutDialog />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event-details" element={<EventDetails />} />
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
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
