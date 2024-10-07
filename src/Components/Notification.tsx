import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Badge, Button, Divider, Drawer, Typography } from "@mui/material";
import { AppContext } from "../App";
import { useContext, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { markAsRead } from "../Utils/API";
import { useAuth } from "../Contexts/AuthProvider";

dayjs.extend(relativeTime);

const Notification = () => {
  const { notifications, setNotifications } = useContext(AppContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { jwt } = useAuth();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const membershipNotifications = notifications.filter(
    (n) => n.type === "membership_expiry"
  );
  const eventNotifications = notifications.filter(
    (n) => n.type === "event_upcoming"
  );

  const handleButtonClick = async (jwt: string, id: number) => {
    try {
      const response = await markAsRead(jwt, id);

      if (response.status === 204) {
        const updatedNotifications = notifications.filter((n) => n.id !== id);
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button color="inherit" onClick={toggleDrawer}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsNoneIcon />
        </Badge>
      </Button>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <div className="w-80 m-6">
          <Typography fontWeight="bold" fontSize="20px" mb="30px">
            <NotificationsNoneIcon />
            Notifications
          </Typography>
          {membershipNotifications.length === 0 &&
            eventNotifications.length === 0 && (
              <Typography>No notifications</Typography>
            )}
          {membershipNotifications.length > 0 && (
            <div className="my-4">
              <Typography fontWeight="bold" fontSize="16px">
                Membership
              </Typography>
              {membershipNotifications.map((n) => (
                <div className="my-4 py-2 bg-slate-100 rounded">
                  <div className="grid grid-cols-30">
                    <div className="flex">
                      <div className="col-span-1 mx-2">
                        <FiberManualRecordIcon
                          style={{
                            color: "green",
                            fontSize: "12px",
                            verticalAlign: "middle",
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="col-span-29">
                          <Typography
                            className="text-left hover:text-red-500"
                            component="button"
                            onClick={() => alert("hello")}
                          >
                            {n.message}
                          </Typography>
                        </div>
                        <div className="col-span-29 flex items-center justify-between ">
                          <Typography fontSize="13px" color="grey">
                            {dayjs(n.createdAt).fromNow()}
                          </Typography>
                          <Button
                            onClick={() => handleButtonClick(jwt, n.id)}
                            variant="text"
                            size="small"
                            style={{
                              textTransform: "none",
                              fontSize: "13px",
                              marginRight: "10px",
                            }}
                          >
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {membershipNotifications.length > 0 && <Divider />}
          {eventNotifications.length > 0 && (
            <div className="my-4">
              <Typography fontWeight="bold" fontSize="16px">
                Events Upcoming
              </Typography>
              {eventNotifications.map((n) => (
                <div className="my-4 py-1 bg-slate-100 rounded">
                  <div className="grid grid-cols-30">
                    <div className="flex">
                      <div className="col-span-1 mx-2">
                        <FiberManualRecordIcon
                          style={{
                            color: "green",
                            fontSize: "12px",
                            verticalAlign: "middle",
                          }}
                        />
                      </div>
                      <div className="col-span-29">
                        <Typography
                          className="text-left pr-2 hover:text-green-500 overflow-hidden break-all"
                          component="button"
                          onClick={() => {
                            navigate(`/event-details/${n.eventId}`);
                            toggleDrawer();
                          }}
                        >
                          {n.message}
                        </Typography>
                        <div className=" flex items-center justify-between">
                          <Typography fontSize="13px" color="grey">
                            {dayjs(n.createdAt).fromNow()}
                          </Typography>
                          <Button
                            onClick={() => handleButtonClick(jwt, n.id)}
                            variant="text"
                            size="small"
                            style={{
                              textTransform: "none",
                              fontSize: "13px",
                              marginRight: "10px",
                            }}
                          >
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Notification;
