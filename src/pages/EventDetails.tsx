import { Avatar, Button, Paper, Tooltip, Typography } from "@mui/material";
import NavBar from "../Components/NavBar";
import { deepOrange } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import dayjs from "dayjs";
import Footer from "../Components/Footer";
import DescriptionDisplay from "../Components/DescriptionDisplay";
import { useAuth } from "../Contexts/AuthProvider";

import { useParams } from "react-router-dom";
import { AppContext, AppEvent } from "../App";
import { useContext, useEffect, useState } from "react";
import Loading from "../Components/Loading";
import checkIsPastEvent from "../Utils/CheckIsPastEvent";
import {
  attendEvent,
  withdrawEvent,
  addToWaitlist,
  cancelWaitlist,
} from "../Utils/API";
import { toast } from "react-toastify";
import ConfirmDialog from "../Components/Dialogs/ConfirmDialog";
import { useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const {
    event,
    setEvent,
    allEvents,
    eventsAttending,
    eventsWaiting,
    setEventsWaiting,
    setAllEvents,
    setUpdateAllEvents,
    setOpenLoginDialog,
  } = useContext(AppContext);
  const { jwt, isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [isPastEvent, setIsPastEvent] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openCancelWaitlistDialog, setOpenCancelWaitlistDialog] =
    useState(false);

  useEffect(() => {
    if (allEvents.length > 0) {
      const event = allEvents.find((event) => event.id === Number(eventId));
      const isPastEvent = checkIsPastEvent(event);
      const isFull = event
        ? event.maxAttendees - event.currentAttendees === 0
        : false;
      setEvent(event);
      if (isAuthenticated) {
        setIsAttending(
          eventsAttending.some((event) => event.id === Number(eventId))
        );
        setIsWaiting(
          eventsWaiting.some((event) => event.id === Number(eventId))
        );
      } else {
        setIsAttending(false);
        setIsWaiting(false);
      }
      setIsFull(isFull);
      setIsPastEvent(isPastEvent);
      setIsLoading(false);
    }
  }, [allEvents, eventId, eventsAttending, eventsWaiting]);

  const handleEventAttending = async (jwt: string, eventId: number) => {
    try {
      const response = await attendEvent(jwt, eventId);
      if (response.status === 200) {
        toast.success("Event attended successfully");
        setUpdateAllEvents((pre: boolean) => !pre);
        setAllEvents((pre: AppEvent[]) =>
          pre.map((event: AppEvent) =>
            event.id === Number(eventId)
              ? { ...event, currentAttendees: response.data.currentAttendees }
              : event
          )
        );
        setIsLoading(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdraw = async (jwt: string, eventId: number) => {
    try {
      const response = await withdrawEvent(jwt, eventId);
      if (response.status === 200) {
        toast.success("Event withdrawn successfully");
        setUpdateAllEvents((pre) => !pre);
        setAllEvents((pre) =>
          pre.map((event) =>
            event.id === Number(eventId)
              ? { ...event, currentAttendees: response.data.currentAttendees }
              : event
          )
        );
        setIsLoading(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWaitlist = async (jwt: string, eventId: string) => {
    try {
      const response = await addToWaitlist(jwt, eventId);
      if (response.status === 200) {
        toast.success("Event added to waitlist successfully");
        if (event) setEventsWaiting((pre: AppEvent[]) => [...pre, event]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelWaitlist = async (jwt: string, eventId: number) => {
    try {
      const response = await cancelWaitlist(jwt, eventId);
      if (response.status === 200) {
        toast.success("Waitlist cancelled successfully");
        setEventsWaiting((pre) => pre.filter((e) => e.id !== Number(eventId)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  console.log("event", event);
  return (
    <>
      <NavBar />
      {isLoading ? (
        <Loading />
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
                {event?.title}
              </Typography>
              <div className="flex items-center">
                <Avatar
                  src={event?.profileImageUrl}
                  sx={{ bgcolor: deepOrange[500] }}
                  style={{
                    width: "45px",
                    height: "45px",
                  }}
                />
                <div className="ml-6">
                  <Typography variant="body2">Hosted By</Typography>
                  {user?.id === event?.userId ? (
                    <Typography sx={{ fontWeight: "bold" }}>You</Typography>
                  ) : (
                    <Tooltip title="Chat with Host">
                      <div
                        className="flex space-x-2  hover:text-blue-500 transition-colors duration-300 cursor-pointer"
                        onClick={() => {
                          if (user?.id !== event?.userId) {
                            navigate(`/chat/${event?.userId}`);
                          }
                        }}
                      >
                        <Typography sx={{ fontWeight: "bold" }}>
                          {event?.user}
                        </Typography>
                        <QuestionAnswerIcon color="info" />
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </Paper>
          <div className="flex-grow flex justify-center bg-slate-100 ">
            <div className="w-3/4 grid grid-cols-3 gap-10 my-10">
              <div className="col-span-2">
                <img
                  className="object-cover"
                  width="100%"
                  src={event?.imageUrl}
                  alt="event photo"
                />
                <div className="mt-6">
                  <DescriptionDisplay description={event?.description ?? ""} />
                </div>
              </div>
              <div className="col-span-1">
                <Paper elevation={3} style={{ borderRadius: "20px" }}>
                  <div className=" p-4">
                    <div className="flex space-x-5 mb-5">
                      <AccessTimeIcon />
                      <div>
                        <Typography variant="body1">
                          {dayjs(event?.startTime).format("dddd D MMMM YYYY")}
                        </Typography>
                        <Typography variant="body1">
                          {dayjs(event?.startTime).format("h:mm A")} to{" "}
                          {dayjs(event?.endTime).format("h:mm A")}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex space-x-5">
                      <LocationOnOutlinedIcon />
                      <div>
                        <Typography variant="body1">
                          {event?.location}
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
                    {dayjs(event?.startTime).format("ddd, MMM D · HH:mm")}
                  </Typography>
                  <Typography style={{ fontWeight: "bold" }}>
                    {event?.title}
                  </Typography>
                </div>
                <div className="col-span-1">
                  {event && (
                    <Typography>
                      {event.maxAttendees - event.currentAttendees} spots left
                    </Typography>
                  )}
                </div>
                <div className="col-span-2 text-right">
                  {isPastEvent ? (
                    <Button color="error" variant="contained" disabled>
                      Past Event
                    </Button>
                  ) : isAttending ? (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => setOpenWithdrawDialog(true)}
                    >
                      Withdraw
                    </Button>
                  ) : isFull ? (
                    isWaiting ? (
                      <Button
                        color="warning"
                        variant="contained"
                        onClick={() => setOpenCancelWaitlistDialog(true)}
                      >
                        You are on the waitlist
                      </Button>
                    ) : (
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => {
                          if (jwt && eventId) handleWaitlist(jwt, eventId);
                        }}
                      >
                        Add Waitlist
                      </Button>
                    )
                  ) : (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => {
                        if (isAuthenticated && jwt && event) {
                          handleEventAttending(jwt, event.id);
                        } else {
                          setOpenLoginDialog(true);
                        }
                      }}
                    >
                      Attend
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
      <ConfirmDialog
        open={openWithdrawDialog}
        onClose={() => setOpenWithdrawDialog(false)}
        title="Withdraw from Event"
        message="Are you sure you want to withdraw from this event?"
        actionName="Yes"
        action={() => {
          if (jwt && event) {
            handleWithdraw(jwt, event.id);
          }
          setOpenWithdrawDialog(false);
        }}
      />
      <ConfirmDialog
        open={openCancelWaitlistDialog}
        onClose={() => setOpenCancelWaitlistDialog(false)}
        title="Cancel Waitlist"
        message="Are you sure you want to cancel the waitlist?"
        actionName="Yes"
        action={() => {
          if (jwt && event) {
            handleCancelWaitlist(jwt, event.id);
          }
          setOpenCancelWaitlistDialog(false);
        }}
      />
    </>
  );
};

export default EventDetails;
