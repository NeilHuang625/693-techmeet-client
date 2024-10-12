import { MessageProps } from "../pages/Chat";

const checkUnreadMessage = (
  messages: MessageProps[],
  senderId: string,
  receiverId: string
) => {
  return !!messages.some(
    (message) =>
      message.senderId === receiverId &&
      message.receiverId === senderId &&
      !message.isRead
  );
};

export default checkUnreadMessage;
