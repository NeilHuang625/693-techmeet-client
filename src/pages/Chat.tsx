import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import { useContext } from "react";

const Chat = () => {
  const { userId } = useParams();
  const { hubConnection, message, setMessage, messages, setMessages } =
    useContext(AppContext);

  const sendMessage = async () => {
    try {
      await hubConnection?.send("SendMessageToUser", userId, message);
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
            <div key={i}>{m}</div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
