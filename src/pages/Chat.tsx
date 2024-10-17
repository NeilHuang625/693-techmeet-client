import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import { useContext, useEffect, useRef, useState } from "react";
import { markMessagesAsRead, getReceiverInfo } from "../Utils/API";
import checkUnreadMessage from "../Utils/checkUnreadMessage";
import groupMessagesByReceiver from "../Utils/groupMessagesByReceiver";
import { useAuth } from "../Contexts/AuthProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { FilledInput, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import SmsIcon from "@mui/icons-material/Sms";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import { FormControl, FormHelperText, InputAdornment } from "@mui/material";
import Loading from "../Components/Loading";
import { User } from "../Contexts/AuthProvider";

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
  senderImageUrl: string;
  receiverImageUrl: string;
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
        <Box sx={{ p: 2 }}>
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
  const {
    event,
    hubConnection,
    message,
    setMessage,
    messages,
    setMessages,
    messagesAfterGroup,
    setMessagesAfterGroup,
  } = useContext(AppContext);

  if (!messages) {
    return <Loading />;
  }

  const [value, setValue] = useState(-1);
  const [error, setError] = useState("");
  const [receiverInfo, setReceiverInfo] = useState<User>({} as User);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(scrollToBottom, [messages, receiverId, value, messagesAfterGroup]);

  useEffect(() => {
    if (messages && receiverId) {
      const groupedMessages = groupMessagesByReceiver(
        receiverId || "",
        userId || "",
        jwt || "",
        messages,
        setMessages
      );

      if (!groupedMessages.hasOwnProperty(receiverId)) {
        groupedMessages[receiverId] = { messages: [], unreadCount: 0 };
      }
      setMessagesAfterGroup(groupedMessages);
    }
  }, [messages, receiverId]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (receiverId) {
      const index = Object.keys(messagesAfterGroup).findIndex(
        (key) => key === receiverId
      );
      setValue(index);
    }
  }, [messagesAfterGroup, receiverId]);

  useEffect(() => {
    const fetchReceiverInfo = async () => {
      try {
        const response = await getReceiverInfo(jwt || "", receiverId || "");
        setReceiverInfo(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (receiverId) {
      fetchReceiverInfo();
    }
  }, [receiverId]);

  const sendMessage = async () => {
    if (message.trim() === "") {
      setError("Please type something...");
    } else {
      try {
        await hubConnection?.send("SendMessageToUser", receiverId, message);
        setMessage("");
      } catch (err) {
        console.error(err);
      }
      setError("");
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

  console.log("receiverInfo", receiverInfo);

  return (
    <div className="flex flex-col h-full">
      <NavBar />
      <div className="flex-grow mt-6 ">
        <Box
          className="mx-auto shadow-lg"
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            height: 510,
            width: 930,
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider", width: "370px" }}
          >
            {Object.entries(messagesAfterGroup).map(
              ([receiversId, { messages, unreadCount }], index) => (
                <Tab
                  style={
                    value == index
                      ? { backgroundColor: "#caf0f8", borderRadius: "5px" }
                      : {}
                  }
                  onClick={() => {
                    navigate(`/chat/${receiversId}`);
                    if (userId) {
                      if (checkUnreadMessage(messages, userId, receiversId)) {
                        console.log("mark as read");
                        handleMarkMessagesAsRead(receiversId);
                      }
                    }
                  }}
                  label={
                    <div className="grid grid-cols-11 w-full items-center">
                      <div
                        className="col-span-2 left"
                        style={{ textAlign: "left" }}
                      >
                        <Avatar
                          sx={{ borderRadius: "20%" }}
                          variant="rounded"
                          src={
                            messages.length === 0
                              ? event.profileImageUrl
                              : messages[0]?.senderId === userId
                              ? messages[0]?.receiverImageUrl
                              : messages[0]?.senderImageUrl
                          }
                        />
                      </div>
                      <div className="col-span-4 middle flex flex-col flex-grow">
                        <div
                          className="chat-name"
                          style={{
                            textTransform: "none",
                            textAlign: "left",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {messages.length === 0
                            ? receiverInfo.nickname
                            : messages[0]?.senderId === userId
                            ? messages[0]?.receiverNickname
                            : messages[0]?.senderNickname}
                        </div>
                        <div
                          style={{
                            textTransform: "none",
                            textAlign: "left",
                            fontSize: "small",
                          }}
                          className="chat-message overflow-hidden whitespace-nowrap text-ellipsis"
                        >
                          {messages[messages.length - 1]?.content}
                        </div>
                      </div>
                      <div className="col-span-5 right mx-2">
                        <div
                          style={{
                            textTransform: "none",
                            textAlign: "right",
                            fontSize: "small",
                          }}
                        >
                          {dayjs(
                            dayjs
                              .utc(messages[messages.length - 1]?.createdAt)
                              .local()
                              .format()
                          ).fromNow()}
                        </div>
                        <div
                          style={{ textAlign: "right", paddingRight: "10px" }}
                        >
                          <Badge badgeContent={unreadCount} color="error" />
                        </div>
                      </div>
                    </div>
                  }
                  {...a11yProps(index)}
                  key={`tab-${receiverId}-${index}`}
                />
              )
            )}
          </Tabs>
          <div className="flex flex-col w-[530px] h-full">
            <TabPanel value={value} index={-1}>
              <div className="flex justify-center">
                <SmsIcon style={{ fontSize: 200 }} />
              </div>
              <Typography className="flex justify-center ">
                TechMeet Chat Room
              </Typography>
              <Typography className="flex justify-center ">
                Please select a chat to start messaging
              </Typography>
            </TabPanel>
            {Object.entries(messagesAfterGroup).map(
              ([receiverId, { messages, unreadCount }], index) => (
                <TabPanel
                  value={value}
                  index={index}
                  key={`tabpanel-${receiverId}-${index}`}
                  style={{ overflowY: "scroll", flexGrow: 1 }}
                >
                  {messages.map((message: MessageProps) => (
                    <div key={message.id} className="flex flex-col w-full my-4">
                      <div
                        className={`${
                          message.senderId === userId
                            ? "flex justify-end"
                            : "flex justify-start"
                        }`}
                      >
                        {message.senderId !== userId && (
                          <Avatar
                            sx={{ width: 38, height: 38, borderRadius: "30%" }}
                            style={{ marginRight: "5px" }}
                            variant="rounded"
                            src={message.senderImageUrl}
                          />
                        )}
                        <div
                          style={{ maxWidth: "70%" }}
                          className={`${
                            message.senderId === userId
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-black"
                          } p-2 rounded-lg overflow-auto break-words`}
                        >
                          {message.content}
                        </div>
                        {message.senderId === userId && (
                          <Avatar
                            sx={{ width: 38, height: 38, borderRadius: "30%" }}
                            style={{ marginLeft: "5px" }}
                            variant="rounded"
                            src={message.senderImageUrl}
                          />
                        )}
                      </div>
                      <div
                        className={`${
                          message.senderId === userId
                            ? "flex justify-end"
                            : "flex justify-start"
                        }`}
                      >
                        <div
                          className={`${
                            message.senderId === userId
                              ? "text-right text-sm text-gray-500 pr-12"
                              : "text-left text-sm text-gray-500 pl-12"
                          }`}
                        >
                          {dayjs(
                            dayjs.utc(message.createdAt).local().format()
                          ).fromNow()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </TabPanel>
              )
            )}
            {!!receiverId && (
              <div className="flex">
                <FormControl sx={{ m: 1, width: "95%" }} variant="filled">
                  <FilledInput
                    type="text"
                    placeholder="Happy chat..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (e.target.value.trim() !== "") {
                        setError("");
                      }
                    }}
                    id="filled-adornment-weight"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={sendMessage}>
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                        e.preventDefault();
                      }
                    }}
                    aria-describedby="filled-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                  />
                  <FormHelperText
                    sx={{ height: "8px" }}
                    id="filled-weight-helper-text"
                  >
                    {error ? error : ""}
                  </FormHelperText>
                </FormControl>
              </div>
            )}
          </div>
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
