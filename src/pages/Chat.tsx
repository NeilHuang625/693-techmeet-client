import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import { useContext, useEffect } from "react";
import { GetChatMessages } from "../Utils/API";
import { useAuth } from "../Contexts/AuthProvider";

export interface MessageProps {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  receiverId: string;
  receiverNickname: string;
}

const Chat = () => {
  const { receiverId } = useParams();
  const { jwt } = useAuth();
  const { hubConnection, message, setMessage, messages, setMessages } =
    useContext(AppContext);
  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await GetChatMessages(jwt || "", receiverId || "");
        console.log(response);
        setMessages(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChatMessages();
  }, []);

  const sendMessage = async () => {
    try {
      await hubConnection?.send("SendMessageToUser", receiverId, message);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <NavBar />
      <div className="flex-grow mt-20">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
        <p>Messages here</p>
        <div>
          {messages.map((m, i) => (
            <div key={i} className="my-8">
              <p>{m.content}</p>
              <p>{m.receiverNickname}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
