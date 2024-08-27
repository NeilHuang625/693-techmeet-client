import Home from "./Home";
import { ThemeProvider } from "./Contexts/ThemeProvider";
import { AuthProvider } from "./Contexts/AuthProvider";
import { BrowserRouter as Router } from "react-router-dom";

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
        <Router>
          <Home />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
