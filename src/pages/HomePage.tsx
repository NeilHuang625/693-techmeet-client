import NavBar from "../Components/NavBar";
import EventSlide from "../Components/EventSlide";
import FilterBar from "../Components/FilterBar";
import EventContainer from "../Components/EventContainer";
import Footer from "../Components/Footer";
import { AppContext } from "../App";
import { useContext } from "react";

const HomePage = ({ handleFilterClick }) => {
  const { events } = useContext(AppContext);
  return (
    <>
      <div className="flex flex-col min-h-full">
        <NavBar />
        <div className="flex-grow">
          <EventSlide />
          <FilterBar handleFilterClick={handleFilterClick} />
          {events.length === 0 ? (
            <div className="flex justify-center mt-5 ">No events found</div>
          ) : (
            <EventContainer events={events} />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
