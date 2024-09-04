import Home from "./Home";
import { ThemeProvider } from "./Contexts/ThemeProvider";
import { AuthProvider } from "./Contexts/AuthProvider";
import { BrowserRouter as Router } from "react-router-dom";
import JwtTimeoutDialog from "./Components/Dialogs/JwtTimeoutDialog";

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
        <Router>
          <Home />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
