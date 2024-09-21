import { Avatar, Button, Paper, Typography } from "@mui/material";
import NavBar from "../Components/NavBar";
import { deepOrange } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import dayjs from "dayjs";
import Footer from "../Components/Footer";
import DescriptionDisplay from "../Components/DescriptionDisplay";

import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import { useContext, useEffect, useState } from "react";

const EventDetails = () => {
  const { eventId } = useParams();
  const { allEvents, setAllEvents } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (allEvents.length > 0) {
      const event = allEvents.find((event) => event.id === Number(eventId));
      setEvent(event);
      setIsLoading(false);
    }
  }, [allEvents, eventId]);

  return (
    <>
      <NavBar />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="relative flex flex-col min-h-screen justify-center">
          <Paper elevation={3} className="flex justify-center w-full py-7 mb-1">
            <div className="w-3/4">
              <Typography
                variant="h5"
                style={{
                  fontWeight: "bolder",
                  marginBottom: "15px",
                }}
                gutterBottom
              >
                {event.title}
              </Typography>
              <div className="flex items-center">
                <Avatar
                  sx={{ bgcolor: deepOrange[500] }}
                  style={{
                    width: "45px",
                    height: "45px",
                  }}
                >
                  {event.user[0]}
                </Avatar>
                <div className="ml-6">
                  <Typography variant="body2">Hosted By</Typography>
                  <Typography variant="body2" style={{ fontWeight: "bold" }}>
                    {event.user}
                  </Typography>
                </div>
              </div>
            </div>
          </Paper>
          <div className="flex-grow flex justify-center bg-slate-100 ">
            <div className="w-3/4 grid grid-cols-3 gap-10 my-10">
              <div className="col-span-2">
                <img
                  className="object-cover"
                  src={event.imageUrl}
                  alt="event photo"
                />
                <div className="mt-6">
                  <DescriptionDisplay description={event.description} />
                </div>
              </div>
              <div className="col-span-1">
                <Paper elevation={3} style={{ borderRadius: "20px" }}>
                  <div className=" p-4">
                    <div className="flex space-x-5 mb-5">
                      <AccessTimeIcon />
                      <div>
                        <Typography variant="body1">
                          {dayjs(event.startTime).format("dddd D MMMM YYYY")}
                        </Typography>
                        <Typography variant="body1">
                          {dayjs(event.startTime).format("h:mm A")} to{" "}
                          {dayjs(event.endTime).format("h:mm A")}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex space-x-5">
                      <LocationOnOutlinedIcon />
                      <div>
                        <Typography variant="body1">
                          {event.location}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
          {/* attend bar */}
          <div className="sticky bottom-0 bg-white">
            <div className="w-full flex justify-center py-3">
              <div className="w-3/4 grid grid-cols-7 gap-2 items-center">
                <div className="col-span-4">
                  <Typography>
                    {dayjs(event.startTime).format("ddd, MMM D · HH:mm")}
                  </Typography>
                  <Typography style={{ fontWeight: "bold" }}>
                    {event.title}
                  </Typography>
                </div>
                <div className="col-span-2">
                  <Typography>
                    {event.maxAttendees - event.currentAttendees} spots left
                  </Typography>
                </div>
                <div className="col-span-1 text-right">
                  <Button color="error" variant="contained">
                    Attend
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventDetails;
