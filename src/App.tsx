import Home from "./Home";
import { ThemeProvider } from "./Contexts/ThemeProvider";
import { AuthProvider } from "./Contexts/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import JwtTimeoutDialog from "./Components/Dialogs/JwtTimeoutDialog";
import CreateEvent from "./pages/CreateEvent";

export interface AppEvent {
  eventId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  imagePath: string;
  userId: string;
  maxParticipants: string;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JwtTimeoutDialog />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <CreateEvent />
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
