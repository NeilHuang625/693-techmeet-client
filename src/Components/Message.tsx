import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Badge, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import { AppContext } from "../App";
import { useContext } from "react";
import { useAuth } from "../Contexts/AuthProvider";
import dayjs from "dayjs";
import { MessageProps } from "../pages/Chat";

const Message = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { messages } = useContext(AppContext);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [messagesAfterGroup, setMessagesAfterGroup] = useState<{
    [key: string]: { messages: MessageProps[]; unreadCount: number };
  }>({});

  useEffect(() => {
    const messagesAfterGroup = messages.reduce(
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
          if (!message.isRead && message.receiverId === userId) {
            acc[otherUserId].unreadCount += 1;
          }
        }
        return acc;
      },
      {}
    );
    console.log("messagesAfterGroup", messagesAfterGroup);

    const totalUnreadCount = Object.values(messagesAfterGroup).reduce(
      (acc, { unreadCount }) => acc + unreadCount,
      0
    );
    setTotalUnreadCount(totalUnreadCount);
    setMessagesAfterGroup(messagesAfterGroup);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <div>
        <IconButton
          color="inherit"
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Badge badgeContent={totalUnreadCount} color="error">
            <ChatBubbleOutlineIcon />
          </Badge>
        </IconButton>
      </div>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: 360,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 52,
                height: 52,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {Object.entries(messagesAfterGroup).map(
          ([receiverId, { messages, unreadCount }]) => (
            <MenuItem key={receiverId} onClick={handleClose}>
              <div className="grid grid-cols-6">
                <div className="col-span-1 left">
                  <Avatar />
                </div>
                <div className="col-span-3 middle flex flex-col">
                  <div className="chat-name ">
                    {messages[0].senderId === userId
                      ? messages[0].receiverNickname
                      : messages[0].senderNickname}
                  </div>
                  <div className="chat-message text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                    {messages[messages.length - 1].content}
                  </div>
                </div>
                <div className="col-span-2 right text-right mx-2">
                  <div className="text-sm">
                    {dayjs(
                      dayjs
                        .utc(messages[messages.length - 1].createdAt)
                        .local()
                        .format()
                    ).fromNow()}
                  </div>
                  <ListItemIcon>
                    <Badge badgeContent={unreadCount} color="error" />
                  </ListItemIcon>
                </div>
              </div>
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
};

export default Message;
