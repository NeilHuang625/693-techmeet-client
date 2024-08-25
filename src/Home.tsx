import { Container, Grid } from "@mui/material";
import NavBar from "./Components/NavBar";
import EventCard from "./Components/EventCard";
import { AppContext } from "./Contexts/AppContext";
import { useContext } from "react";

const Home: React.FC = () => {
  const { events } = useContext(AppContext);

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        <Grid container spacing={2}>
          {events.map((event, index) => (
            <Grid item xs={4} key={index}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
