import { MessageProps } from "../pages/Chat";
import { markMessagesAsRead } from "./API";

const groupMessagesByReceiver = (
  receiverId: string,
  userId: string,
  jwt: string,
  messages: MessageProps[],
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>
) => {
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
          try {
            markMessagesAsRead(jwt || "", receiverId || "");
          } catch (err) {
            console.error(err);
          }
        }
      }

      return acc;
    },
    {}
  );
};

export default groupMessagesByReceiver;
