import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { GetChatMessages, markMessagesAsRead } from "../Utils/API";
import checkUnreadMessage from "../Utils/checkUnreadMessage";
import { useAuth } from "../Contexts/AuthProvider";
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";
import relativeTime from "dayjs/plugin/relativeTime";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export interface MessageProps {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  receiverNickname: string;
  senderNickname: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  style: React.CSSProperties;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Chat = () => {
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const { jwt, user } = useAuth();
  const userId = user?.id;
  const { hubConnection, message, setMessage, messages, setMessages } =
    useContext(AppContext);

  const [value, setValue] = useState(0);
  const [messagesAfterGroup, setMessagesAfterGroup] = useState({});

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await GetChatMessages(jwt || "", receiverId || "");
        setMessages(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChatMessages();
  }, [receiverId]);

  const groupMessagesByReceiver = (messages: MessageProps[]) => {
    return messages.reduce(
      (
        acc: {
          [key: string]: { messages: MessageProps[]; unreadCount: number };
        },
        message: MessageProps
      ) => {
        let otherUserId = null;
        if (message.receiverId === userId) {
          otherUserId = message.senderId;
        } else if (message.senderId === userId) {
          otherUserId = message.receiverId;
        }

        if (otherUserId) {
          if (!acc[otherUserId]) {
            acc[otherUserId] = { messages: [], unreadCount: 0 };
          }
          acc[otherUserId].messages.push(message);

          // If the message is unread, and the receiver is the current user, and currently not chatting with this sender, increment the unread count.
          if (
            !message.isRead &&
            message.receiverId === userId &&
            message.senderId !== receiverId
          ) {
            acc[otherUserId].unreadCount += 1;
          } else if (
            !message.isRead &&
            message.receiverId === userId &&
            message.senderId === receiverId
          ) {
            setMessages((preMessages) =>
              preMessages.map((m) =>
                m.id === message.id ? { ...m, isRead: true } : m
              )
            );
            handleMarkMessagesAsRead(receiverId);
          }
        }

        return acc;
      },
      {}
    );
  };

  useEffect(() => {
    if (messages) {
      const groupedMessages = groupMessagesByReceiver(messages);
      setMessagesAfterGroup(groupedMessages);
    }
  }, [messages]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const sendMessage = async () => {
    try {
      await hubConnection?.send("SendMessageToUser", receiverId, message);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkMessagesAsRead = async (receiverId: string) => {
    try {
      const response = await markMessagesAsRead(jwt || "", receiverId);
      if (response.status === 200) {
        const updatedMessages = messages.map((m) => {
          if (
            m.receiverId === userId &&
            m.senderId === receiverId &&
            !m.isRead
          ) {
            return { ...m, isRead: true };
          } else {
            return m;
          }
        });
        setMessages(updatedMessages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <NavBar />
      <div className="flex-grow mt-10">
        <div className="flex justify-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            height: 400,
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            {Object.entries(messagesAfterGroup).map(
              ([receiversId, { messages, unreadCount }], index) => (
                <Tab
                  onClick={() => {
                    navigate(`/chat/${receiversId}`);
                    if (userId) {
                      if (checkUnreadMessage(messages, userId, receiversId)) {
                        console.log("mark as read");
                        handleMarkMessagesAsRead(receiversId);
                      }
                    }
                  }}
                  label={`${
                    messages[0].senderId === userId
                      ? messages[0].receiverNickname
                      : messages[0].senderNickname
                  } (${unreadCount})`}
                  {...a11yProps(index)}
                  key={`tab-${receiverId}-${index}`}
                />
              )
            )}
          </Tabs>
          {Object.entries(messagesAfterGroup).map(
            ([receiverId, { messages, unreadCount }], index) => (
              <TabPanel
                value={value}
                index={index}
                key={`tabpanel-${receiverId}-${index}`}
                style={{ overflowY: "scroll" }}
              >
                {messages.map((message: MessageProps) => (
                  <div key={message.id} className="flex flex-col my-4">
                    <div className="flex justify-between">
                      <div>
                        {dayjs(
                          dayjs.utc(message.createdAt).local().format()
                        ).fromNow()}
                      </div>
                    </div>
                    <div>{message.content}</div>
                    <div>sent from:{message.senderNickname}</div>
                  </div>
                ))}
              </TabPanel>
            )
          )}
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
